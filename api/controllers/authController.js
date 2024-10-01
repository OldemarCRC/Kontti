import User from "../models/userModel.js";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationEmail,
  sendPasswordChangeNotification,
  sendLoginNotification,
  sendFailLoginNotification,
} from "../utils/mailer.js";
import { generateRandomPassword } from "../utils/passwordUtils.js";

export const register = async (req, res, next) => {
  try {
    // Generar una contraseña aleatoria
    const temporaryPassword = generateRandomPassword();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(temporaryPassword, salt);
    /* const userForEmail = req.body.username; */
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      phone: req.body.phone,
      passwordChangeRequired: true,
      passwordExpiresAt: new Date(Date.now() + 1440 * 60 * 1000), // 24 horas desde ahora
    });

    const user = await newUser.save();

    // Generar un token de verificación
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: "1d" } // El token expira en 1 día
    );

    // Crear URL de verificación
    const verificationUrl = `https://kontti-client.onrender.com/account-verification?token=${verificationToken}`;

    // Enviar correo electrónico de verificación con la contraseña temporal
    await sendVerificationEmail(
      user.email,
      verificationUrl,
      temporaryPassword,
      user.username
    );

    res
      .status(200)
      .send(
        "El usuario ha sido creado. El usuario debe revisar su correo para verificar la cuenta y cambiar su contraseña temporal."
      );
  } catch (err) {
    next(err);
  }
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 intentos por ventana por IP
  message: "Demasiados intentos de inicio de sesión, por favor intente más tarde.",
  standardHeaders: true, // Devolver información de rate limit en los headers
  legacyHeaders: false, // Desactivar los headers 'X-RateLimit-*'
});

export const loginSecurityMiddleware = async (req, res, next) => {
  const { username } = req.body;
  const ip = req.ip;

  let user = await User.findOne({ username });

  if (user) {
    // Registrar intento
    user.loginAttempts.push({ date: new Date(), ip });
    await user.save();

    // Verificar si el usuario está bloqueado
    if (user.isLocked) {
      return res
        .status(403)
        .json({ message: "Usuario bloqueado. Contacte al administrador." });
    }

    // Verificar intentos recientes
    const recentAttempts = user.loginAttempts.filter(
      (attempt) => attempt.date > new Date(Date.now() - 15 * 60 * 1000)
    ).length;

    if (recentAttempts > 10) {
      user.isLocked = true;
      user.lockedAt = new Date();
      await user.save();
      return res
        .status(429)
        .json({ message: "Demasiados intentos. Usuario bloqueado." });
    }
  } else {
    // Si el usuario no existe, aún registramos el intento para prevenir enumeración
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
      // Incrementamos el retraso incluso para usuarios no existentes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return next(createError(404, "Usuario o contraseña incorrectos."));
    }

    // Verificar si el usuario está bloqueado
    if (user.isLocked) {
      return next(
        createError(403, "Usuario bloqueado. Contacte al administrador.")
      );
    }

    // Verificar si la contraseña temporal ha expirado
    if (user.passwordChangeRequired && user.passwordExpiresAt < new Date()) {
      user.isLocked = true;
      await user.save();
      return next(
        createError(
          403,
          "Tu contraseña temporal ha expirado. Contacta al administrador."
        )
      );
    }

    // Verificar si el correo electrónico del usuario ha sido verificado
    if (!user.isEmailVerified) {
      return next(
        createError(
          403,
          "Por favor verifique su correo antes de intentar iniciar sesión."
        )
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      // Incrementar el número de intentos
      user.attempts += 1;
      user.lastLoginAttempt = new Date();

      const failLoginattemptDate = new Date().toLocaleString();
      const userIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        try {
          await sendFailLoginNotification(user.email, user.username, failLoginattemptDate, userIp);
        } catch (err) {
          console.error("Error enviando notificación de fallo de inicio de sesión: ", err);
        }

      if (user.attempts >= 3) {
        user.isLocked = true;
        user.lockedAt = new Date();
        await user.save();
        return next(
          createError(
            403,
            "Usuario bloqueado debido a múltiples intentos fallidos. Contacte al administrador."
          )
        );
      }

      await user.save();

      // Incrementar el retraso con cada intento fallido
      await new Promise((resolve) => setTimeout(resolve, user.attempts * 1000));

      return next(createError(400, "Usuario o contraseña incorrectos."));
    }

    // Resetear los intentos si el login es exitoso
    user.attempts = 0;
    user.lastLoginAttempt = new Date();
    await user.save();

    const loginDate = new Date().toLocaleString();
    const userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await sendLoginNotification(user.email, user.username, loginDate, userIp);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT, {
      expiresIn: "1d",
    });

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails } });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query; // Obtener el token de la URL

    if (!token) {
      return next(createError(400, "Token no proporcionado."));
    }

    // Verificar el token utilizando jwt.verify
    jwt.verify(token, process.env.JWT, async (err, decoded) => {
      if (err) {
        console.log("Error al verificar el token:", err);
        return next(createError(400, "Token inválido o expirado."));
      }

      const userId = decoded.userId;
      // Buscar el usuario por ID y actualizar isEmailVerified a true
      const user = await User.findByIdAndUpdate(
        userId,
        { isEmailVerified: true },
        { new: true }
      );

      if (!user) {
        return next(createError(404, "Usuario no encontrado."));
      }

      // Redirigir al usuario a la página de inicio de sesión o página de éxito
      // O simplemente enviar una respuesta de éxito
      res
        .status(200)
        .send(
          "Correo electrónico verificado exitosamente. Ahora puedes iniciar sesión."
        );
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.body.userId; // O obtener el ID de usuario de alguna otra manera, e.g., a través de un token JWT
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "¡Usuario no existe!"));
    }

    // Verificar si la contraseña actual es correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(createError(400, "¡Contraseña actual no es correcta!"));
    }

    // Generar hash de la nueva contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Actualizar la contraseña del usuario
    user.password = hashedNewPassword;
    user.passwordChangeRequired = false;
    user.passwordExpiresAt = null;
    await user.save();

    const changeDate = new Date().toLocaleString();
    const userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await sendPasswordChangeNotification(
      user.email,
      user.username,
      changeDate,
      userIp
    );

    res.status(200).send("¡Contraseña ha sido cambiada exitosamente!");
  } catch (err) {
    next(err);
  }
};
