import nodemailer from 'nodemailer';

// Existing Registration OTP Email
export const sendEmailOtp = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DLSP Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your DLSP Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Account Verification</h2>
          <p>Your One-Time Password (OTP) for registration is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This code is valid for <strong>5 minutes</strong>. Do not share it.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};

// NEW: Password Reset OTP Email
export const sendPasswordResetEmail = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"DLSP Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Use the OTP below to set a new password:</p>
          <h1 style="color: #FF5722; letter-spacing: 5px;">${otp}</h1>
          <p>This code is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Could not send email');
  }
};