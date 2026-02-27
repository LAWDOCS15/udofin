import nodemailer from 'nodemailer';

// Existing Registration OTP Email
export const sendEmailOtp = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER ,
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

//  Password Reset OTP Email
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

//   Registration success mail

export const sendRegistrationSuccessEmail = async (email: string, name: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to FinLend - Registration Successful 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to FinLend!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been successfully verified and created. You can now start applying for loans and tracking your application status with ease.</p>
          <p style="background: #f4f4f4; padding: 10px; border-left: 4px solid #4CAF50;">
            <strong>Security Tip:</strong> We will never ask for your password over email or phone. 
          </p>
          <br/>
          <p>Best Regards,<br/><strong>The FinLend Team</strong></p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) { console.error('Registration email failed:', error); }
};

export const sendLoginAlertEmail = async (email: string, name: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
      from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New Login Alert - FinLend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2196F3;">New Login Detected</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your FinLend account was just accessed.</p>
          <ul>
            <li><strong>Time:</strong> ${time} (IST)</li>
          </ul>
          <p style="color: #d9534f; font-weight: bold;">
            If this was you, you can safely ignore this email. If you did not log in, please reset your password immediately!
          </p>
          <br/>
          <p>Stay Secure,<br/><strong>FinLend Security Team</strong></p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) { console.error('Login alert email failed:', error); }
};

//send reset password mail
export const sendPasswordResetSuccessEmail = async (email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password was Successfully Reset 🔒',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #FF9800;">Password Changed Successfully</h2>
          <p>Hello,</p>
          <p>We are writing to confirm that the password for your FinLend account has been successfully reset.</p>
          <p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;">
            <strong>Important:</strong> If you did not make this change, please contact our support team immediately to secure your account.
          </p>
          <br/>
          <p>Best Regards,<br/><strong>FinLend Security Team</strong></p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) { console.error('Password reset success email failed:', error); }
};