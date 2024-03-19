import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationUrl) => {
    const subject = "Verifica tu cuenta de correo";
    const htmlContent = `
      <h1>Verificación de correo</h1>
      <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Verificar cuenta</a>
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
      from: '"KONTTI" <oldemar.chaves@gmail.com>', // Asegúrate de incluir los ángulos < > alrededor del correo electrónico
      to: email,
      subject: subject, // O simplemente "subject," si utilizas la propiedad shorthand de ES6
      html: htmlContent, // Aquí utilizas la variable htmlContent
    });
  };
