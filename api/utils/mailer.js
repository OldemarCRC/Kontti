import nodemailer from "nodemailer";

export const sendVerificationEmail = async (fullName, email, verificationUrl, temporaryPassword, username) => {
    const subject = "Check your email account and change your password for your account on Kontti";
    const htmlContent = `
      <h1>Email verification</h1>
      <p>To:  ${fullName}</p
      <p>Your user is: <strong>${username}</strong></p>
      <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
      <p>Please change this password immediately after logging in.</p>
      <p>You have 24 hours to change your password before your account is locked.</p>
      <p>Click the button below to verify your account:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #276ba6; color: white; text-decoration: none;">Verify account</a>
      <p>If you did not create an account using this email address, please ignore this message.</p>
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

  export const sendPasswordChangeNotification = async (email, fullName, username, changeDate, userIp) => {
    const subject = "Password Change Notification";
    const htmlContent = `
      <h1>Hi <strong>${fullName}</strong>!</h1>
    
    <p>We want to inform you that your password has been updated in your Kontti account.</p>
     <p><strong>Date and time of change:</strong> ${changeDate}</p>
    <p><strong>IP address of change:</strong> ${userIp}</p>
    <p>If you have made this change, you do not need to take any further action.</p>
    <p>If you were not the one who performed this action, we recommend that you immediately contact your administrator or our support team to protect your account.</p>

    <h2><strong>Details of the change</strong></h2>
    <ul>
      <li><strong>User:</strong> ${username}</li>
      <li><strong>IP Address:</strong> ${userIp}</li>
    </ul>

    <p>Thank you for using Kontti.</p>

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

  export const sendLoginNotification = async (email, fullName, username, loginDate, userIp) => {
    const subject = "Notificación de inicio de sesión";
    const htmlContent = `
      <h1>Hello <strong>${fullName}</strong>!</h1>
    
    <p style="font-size: 24px; color: #13c92b;">You are logged in to Kontti.</p>
    <p><strong>Date and time of login:</strong> ${loginDate}</p>
    <p><strong>Login IP address:</strong> ${userIp}</p>
    <p>If you are the one who logged in, you do not need to take any further action.</p>
    <p>If you were not the one who performed this action, we recommend that you immediately contact your administrator or our support team to protect your account.</p>

    <h2><strong>Login details</strong></h2>
    <ul>
      <li><strong>User:</strong> ${username}</li>
      <li><strong>IP Address:</strong> ${userIp}</li>
    </ul>

    <p>Thank you for using Kontti.</p>

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

  export const sendFailLoginNotification = async (email, fullName, username, failLoginattemptDate, userIp) => {
    const subject = "Failed access attempt notification";
    const htmlContent = `
    <p style="font-size: 24px; color: red;">Failed attempt to access Kontti with the account of <strong>${fullName}</strong>.</p>
    <p><strong>Date and time of attempted login:</strong> ${failLoginattemptDate}</p>
    <p><strong>IP address of start of access attempt:</strong> ${userIp}</p>
    <p>An unsuccessful attempt to log in to the system with your user has been detected.</p>
    <p>f you were not the one who performed this action, we recommend that you immediately contact your administrator or our support team to protect your account.</p>

    <h2><strong>Login details</strong></h2>
    <ul>
      <li><strong>User:</strong> ${username}</li>
      <li><strong>IP Address:</strong> ${userIp}</li>
    </ul>

    <p>Thank you for using Kontti.</p>

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

  export const sendDBConnectionFailureNotification = async (date, ipAddress) => {
    const subject = "DB Connection Failure";
    const htmlContent = `
    <p style="font-size: 24px; color: red;">Failed attempt to access Kontti because <strong>NO DATABASE CONNECTION</strong>.</p>
    <p><strong>Date and time of attempted login:</strong> ${date}</p>
    <p><strong>IP address of start of access attempt:</strong> ${ipAddress}</p>

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
      to: 'oldemar.chaves@gmail.com',
      subject: subject,
      html: htmlContent,
    });
  };
