import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationUrl, temporaryPassword, username) => {
    const subject = "Verifica tu cuenta de correo y cambia tu contraseña de Kontti";
    const htmlContent = `
      <h1>Verificación de correo</h1>
      <p>Tu usuario es: <strong>${username}</strong></p>
      <p>Tu contraseña temporal es: <strong>${temporaryPassword}</strong></p>
      <p>Por favor, cambia esta contraseña inmediatamente después de iniciar sesión.</p>
      <p>Tienes 24 horas para cambiar tu contraseña antes de que tu cuenta se bloquee.</p>
      <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #276ba6; color: white; text-decoration: none;">Verificar cuenta</a>
      <p>Si no creaste una cuenta usando esta dirección de correo, por favor ignora este mensaje.</p>
    `;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: '"Kontti" <oldemar.chaves@gmail.com>',
      to: email,
      bcc: 'oldemar.chaves@gmail.com',
      subject: subject,
      html: htmlContent,
    });
  };

  export const sendPasswordChangeNotification = async (email, username, changeDate, userIp) => {
    const subject = "Notificación de cambio de contraseña";
    const htmlContent = `
      <h1>¡Hola <strong>${username}</strong>!</h1>
    
    <p>Queremos informarle que su contraseña ha sido actualizada en su cuenta de Kontti.</p>
    <p><strong>Fecha y hora del cambio:</strong> ${changeDate}</p>
    <p><strong>Dirección IP del cambio:</strong> ${userIp}</p>
    <p>Si usted ha realizado este cambio, no es necesario que realice ninguna acción adicional.</p>
    <p>Si no fue usted quien realizó esta acción, le recomendamos que contacte inmediatamente a su administrador o a nuestro equipo de soporte para proteger su cuenta.</p>

    <h2><strong>Detalles del cambio</strong></h2>
    <ul>
      <li><strong>Usuario:</strong> ${username}</li>
      <li><strong>Dirección IP:</strong> ${userIp}</li>
    </ul>

    <p>Gracias por utilizar Kontti.</p>

    `;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: '"Kontti" <oldemar.chaves@gmail.com>',
      to: email,
      bcc: 'oldemar.chaves@gmail.com',
      subject: subject,
      html: htmlContent,
    });
  };

  export const sendLoginNotification = async (email, username, loginDate, userIp) => {
    const subject = "Notificación de inicio de sesión";
    const htmlContent = `
      <h1>¡Hola <strong>${username}</strong>!</h1>
    
    <p style="font-size: 24px; color: #13c92b;">Ha iniciado sesión en Kontti.</p>
    <p><strong>Fecha y hora del inicio de sesión:</strong> ${loginDate}</p>
    <p><strong>Dirección IP de inicio de sesión:</strong> ${userIp}</p>
    <p>Si es usted quien ha ingresado, no es necesario que realice ninguna acción adicional.</p>
    <p>Si no fue usted quien realizó esta acción, le recomendamos que contacte inmediatamente a su administrador o a nuestro equipo de soporte para proteger su cuenta.</p>

    <h2><strong>Detalles del inicio de sesión</strong></h2>
    <ul>
      <li><strong>Usuario:</strong> ${username}</li>
      <li><strong>Dirección IP:</strong> ${userIp}</li>
    </ul>

    <p>Gracias por utilizar Kontti.</p>

    `;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: '"Kontti" <oldemar.chaves@gmail.com>',
      to: email,
      bcc: 'oldemar.chaves@gmail.com',
      subject: subject,
      html: htmlContent,
    });
  };

  export const sendFailLoginNotification = async (email, username, failLoginattemptDate, userIp) => {
    const subject = "Notificación de intento fallido de acceso";
    const htmlContent = `
    <p style="font-size: 24px; color: red;">Intento fallido de acceso a Kontti con la cuenta <strong>${username}</strong>.</p>
    <p><strong>Fecha y hora del intento de ingreso:</strong> ${failLoginattemptDate}</p>
    <p><strong>Dirección IP de inicio de intento de acceso:</strong> ${userIp}</p>
    <p>Se ha detectado un intento fallido de ingreso al sistema con su usuario.</p>
    <p>Si no fue usted quien realizó esta acción, le recomendamos que contacte inmediatamente a su administrador o a nuestro equipo de soporte para proteger su cuenta.</p>

    <h2><strong>Detalles del intento de acceso al sistema</strong></h2>
    <ul>
      <li><strong>Usuario:</strong> ${username}</li>
      <li><strong>Dirección IP:</strong> ${userIp}</li>
    </ul>

    <p>Gracias por utilizar Kontti.</p>

    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: '"Kontti" <oldemar.chaves@gmail.com>',
      to: email,
      bcc: 'oldemar.chaves@gmail.com',
      subject: subject,
      html: htmlContent,
    });
  };
