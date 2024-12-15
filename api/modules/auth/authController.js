import User from "../users/userModel.js";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { createError } from "../../services/errorHandler.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordChangeNotification,
  sendLoginNotification,
  sendFailLoginNotification,
  sendDBConnectionFailureNotification,
} from "../../services/mailer.js";
import { generateRandomPassword } from "./passwordUtils.js";


export const isMongoConnected = async (req, res, next) => {
  const isDatabaseConnected = () => mongoose.connection.readyState === 1;
  const date = new Date().toLocaleString();
  const ipAddress = req.ip;
  if (!isDatabaseConnected()) {
    try {
      await sendDBConnectionFailureNotification(date, ipAddress);
    } catch (err) {
      console.error(
        "Error sending database connection failure notification: ",
        err
      );
    }
    return res.status(500).json({ message: "Database is not connected." });
  }
  next();
};


export const register = async (req, res, next) => {
  try {
    const temporaryPassword = generateRandomPassword();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(temporaryPassword, salt);

    const {
      fullName,
      username,
      email,
      role,
      phone,
      createdBy,
    } = req.body;

    const newUser = new User({
      fullName,
      username,
      email,
      password: hash,
      role,
      phone,
      createdBy,
      passwordChangeRequired: true,
      passwordExpiresAt: new Date(Date.now() + 1440 * 60 * 1000), // 24 horas desde ahora
    });

    const user = await newUser.save();

    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: "1d" }
    );

    const verificationUrl = `${process.env.BASE_URL}/account-verification?token=${verificationToken}`;

    await sendVerificationEmail(
      user.fullName,
      user.email,
      verificationUrl,
      temporaryPassword,
      user.username
    );

    res
      .status(200)
      .send(
        "The user has been created. The user must check his/her email to verify the account and change his/her temporary password."
      );
  } catch (err) {
    next(err);
  }
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos por ventana por IP
  message: "Too many login attempts, please try again later.",
  standardHeaders: true, // Devolver información de rate limit en los headers
  legacyHeaders: false, // Desactivar los headers 'X-RateLimit-*'
});

export const loginSecurityMiddleware = async (req, res, next) => {
  const { username } = req.body;
  const ip = req.ip;

  let user = await User.findOne({ username });

  if (user) {
    user.loginAttempts.push({ date: new Date(), ip });
    await user.save();

    if (user.isLocked) {
      return res
        .status(403)
        .json({ message: "User blocked. Contact the administrator." });
    }

    const recentAttempts = user.loginAttempts.filter(
      (attempt) => attempt.date > new Date(Date.now() - 15 * 60 * 1000)
    ).length;

    if (recentAttempts > 10) {
      user.isLocked = true;
      user.lockedAt = new Date();
      await user.save();
      return res
        .status(429)
        .json({ message: "Too many attempts. User blocked." });
    }
  } else {
    await User.updateOne(
      { username: "nonexistent" },
      { $push: { loginAttempts: { date: new Date(), ip } } },
      { upsert: true }
    );
  }

  next();
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return next(createError(404, "Incorrect username or password."));
    }

    if (user.isLocked) {
      return next(
        createError(403, "User blocked. Contact the administrator.")
      );
    }

    if (user.passwordChangeRequired && user.passwordExpiresAt < new Date()) {
      user.isLocked = true;
      await user.save();
      return next(
        createError(
          403,
          "Your temporary password has expired. Please contact the administrator."
        )
      );
    }

    if (!user.isEmailVerified) {
      return next(
        createError(
          403,
          "Please check your email before trying to log in."
        )
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      user.attempts += 1;
      user.lastLoginAttempt = new Date();

      const failLoginattemptDate = new Date().toLocaleString();
      const userIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      try {
        await sendFailLoginNotification(user.email, user.fullName, user.username, failLoginattemptDate, userIp);
      } catch (err) {
        console.error("Error sending login failure notification: ", err);
      }

      user.loginAttempts.push({ date: new Date(), ip: userIp });

      if (user.attempts >= 3) {
        user.isLocked = true;
        user.lockedAt = new Date();
      }

      await user.save();

      await new Promise((resolve) => setTimeout(resolve, user.attempts * 1000)); // Retraso para mitigar ataques de fuerza bruta

      return next(createError(400, "Incorrect username or password."));
    }

    if (isPasswordCorrect) {
      const token = jwt.sign(
        { id: user._id, role: user.role, username: user.username },
        process.env.JWT,
        { expiresIn: "1d" }
      );

      const userIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const loginDate = new Date().toLocaleString();

      try {
        await sendLoginNotification(
          user.email,
          user.fullName,
          user.username,
          loginDate,
          userIp
        );
      } catch (err) {
        console.error("Error sending login notification: ", err);
      }

      user.attempts = 0;
      user.isLocked = false;
      user.lockedAt = null;
      user.isOnLine = true;
      user.loginAttempts = [];
      user.lastLoginAttempt = new Date();
      await user.save();

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
        })
        .status(200)
        .json({
          details: {
            id: user._id,
            username: user.username,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          }
        });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return next(createError(400, "Token not provided."));
    }

    jwt.verify(token, process.env.JWT, async (err, decoded) => {
      if (err) {
        console.log("Error verifying token:", err);
        return next(createError(400, "Invalid or expired token."));
      }

      const userId = decoded.userId;
      const user = await User.findByIdAndUpdate(
        userId,
        { isEmailVerified: true },
        { new: true }
      );

      if (!user) {
        return next(createError(404, "User not found."));
      }

      res
        .status(200)
        .send(
          "Email successfully verified. You can now log in."
        );
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return next(createError(400, "Invalid input"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User does not exist"));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(createError(400, "Current password is incorrect"));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.passwordChangeRequired = false;
    user.passwordExpiresAt = null;
    await user.save();

    const changeDate = new Date().toLocaleString();
    const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await sendPasswordChangeNotification(
      user.email,
      user.fullName,
      user.username,
      changeDate,
      userIp
    );

    res.status(200).send("Password has been successfully changed");
  } catch (err) {
    next(err);
  }
};
