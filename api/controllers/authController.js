import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/mailer.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      phone: req.body.phone,

    });
    const user = await newUser.save();
    // Generar un token de verificación
    // Esto asume que tienes una clave secreta JWT_SECRET definida en tus variables de entorno
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT,
      { expiresIn: "1d" } // El token expira en 1 día
    );
    // Enviar correo electrónico de verificación
    // La URL de verificación debería ser algo que tu frontend pueda manejar para completar la verificación
    const verificationUrl = `http://localhost:3000/account-verification?token=${verificationToken}`;
    await sendVerificationEmail(user.email, verificationUrl);

    res
      .status(200)
      .send(
        "User has been created. Please check your email to verify your account."
      );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "password or username not correct!"));

      // Verificar si el correo electrónico del usuario ha sido verificado
    if (!user.isEmailVerified) {
      return next(createError(403, "Please verify your email before logging in."));
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT, {
      expiresIn: "1d",
    });

    const { password, ...otherDetails } = user._doc;
    console.log({ otherDetails });
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails } });
     
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
      const { token } = req.query; // Obtener el token de la URL
      
      // Verificar el token utilizando jwt.verify
      jwt.verify(token, process.env.JWT, async (err, decoded) => {
          if (err) {
              return next(createError(400, "Token inválido o expirado."));
          }
          const userId = decoded.userId;
          // Buscar el usuario por ID y actualizar isEmailVerified a true
          const user = await User.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true });
          
          if (!user) {
              return next(createError(404, "Usuario no encontrado."));
          }
          
          // Redirigir al usuario a la página de inicio de sesión o página de éxito
          // O simplemente enviar una respuesta de éxito
          res.status(200).send("Correo electrónico verificado exitosamente. Ahora puedes iniciar sesión.");
      });
  } catch (err) {
      next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.body.userId; // O obtener el ID de usuario de alguna otra manera, e.g., a través de un token JWT
    const { currentPassword, newPassword } = req.body;
console.log("User: ", userId );
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Verificar si la contraseña actual es correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(createError(400, "Current password is incorrect!"));
    }

    // Generar hash de la nueva contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Actualizar la contraseña del usuario
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send("Password has been changed successfully.");
  } catch (err) {
    next(err);
  }
};
