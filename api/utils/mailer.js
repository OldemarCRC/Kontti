
import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, verificationUrl) => {
    const transporter = nodemailer.createTransport({
        // Configura tu transporte SMTP aquí
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: '"KONTTI" oldemar.chaves@gmail.com',
        to: email,
        subject: 'Verifica tu correo electrónico',
        html: `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });
};

