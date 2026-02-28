// import nodemailer from 'nodemailer';

// // Existing Registration OTP Email
// export const sendEmailOtp = async (email: string, otp: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER ,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"DLSP Platform" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Verify your DLSP Account',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>Account Verification</h2>
//           <p>Your One-Time Password (OTP) for registration is:</p>
//           <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
//           <p>This code is valid for <strong>5 minutes</strong>. Do not share it.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Could not send email');
//   }
// };

// //  Password Reset OTP Email
// export const sendPasswordResetEmail = async (email: string, otp: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"DLSP Platform" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Password Reset Request',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px;">
//           <h2>Password Reset Request</h2>
//           <p>We received a request to reset your password. Use the OTP below to set a new password:</p>
//           <h1 style="color: #FF5722; letter-spacing: 5px;">${otp}</h1>
//           <p>This code is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending password reset email:', error);
//     throw new Error('Could not send email');
//   }
// };

// //   Registration success mail

// export const sendRegistrationSuccessEmail = async (email: string, name: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     const mailOptions = {
//       from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Welcome to FinLend - Registration Successful 🎉',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #4CAF50; text-align: center;">Welcome to FinLend!</h2>
//           <p>Hi <strong>${name}</strong>,</p>
//           <p>Your account has been successfully verified and created. You can now start applying for loans and tracking your application status with ease.</p>
//           <p style="background: #f4f4f4; padding: 10px; border-left: 4px solid #4CAF50;">
//             <strong>Security Tip:</strong> We will never ask for your password over email or phone. 
//           </p>
//           <br/>
//           <p>Best Regards,<br/><strong>The FinLend Team</strong></p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) { console.error('Registration email failed:', error); }
// };

// export const sendLoginAlertEmail = async (email: string, name: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

//     const mailOptions = {
//       from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'New Login Alert - FinLend',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #2196F3;">New Login Detected</h2>
//           <p>Hi <strong>${name}</strong>,</p>
//           <p>Your FinLend account was just accessed.</p>
//           <ul>
//             <li><strong>Time:</strong> ${time} (IST)</li>
//           </ul>
//           <p style="color: #d9534f; font-weight: bold;">
//             If this was you, you can safely ignore this email. If you did not log in, please reset your password immediately!
//           </p>
//           <br/>
//           <p>Stay Secure,<br/><strong>FinLend Security Team</strong></p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) { console.error('Login alert email failed:', error); }
// };

// //send reset password mail
// export const sendPasswordResetSuccessEmail = async (email: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//     });

//     const mailOptions = {
//       from: `"FinLend Security" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Your Password was Successfully Reset 🔒',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #FF9800;">Password Changed Successfully</h2>
//           <p>Hello,</p>
//           <p>We are writing to confirm that the password for your FinLend account has been successfully reset.</p>
//           <p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;">
//             <strong>Important:</strong> If you did not make this change, please contact our support team immediately to secure your account.
//           </p>
//           <br/>
//           <p>Best Regards,<br/><strong>FinLend Security Team</strong></p>
//         </div>
//       `,
//     };
//     await transporter.sendMail(mailOptions);
//   } catch (error) { console.error('Password reset success email failed:', error); }
// };


import nodemailer, { Transporter } from 'nodemailer';

/* =====================================================
   ENV VALIDATION
===================================================== */

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM_NAME,
  NODE_ENV,
} = process.env;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error('Email credentials not configured properly.');
}

/* =====================================================
   TRANSPORTER (Singleton)
===================================================== */

const transporter: Transporter = nodemailer.createTransport({
  host: EMAIL_HOST || 'smtp.gmail.com',
  port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* =====================================================
   BASE SEND FUNCTION
===================================================== */

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async ({ to, subject, html }: SendMailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME || 'FinLend Security'}" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email sending failed:', error);

    if (NODE_ENV === 'development') {
      console.log('DEV MODE EMAIL FALLBACK');
      console.log({ to, subject });
    }

    throw new Error('Email service unavailable');
  }
};

/* =====================================================
   EMAIL TEMPLATES
===================================================== */

const buildOtpTemplate = (
  title: string,
  message: string,
  otp: string,
  color: string
): string => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: ${color};">${title}</h2>
  <p>${message}</p>
  <h1 style="letter-spacing: 5px;">${otp}</h1>
  <p>This code is valid for <strong>5 minutes</strong>.</p>
</div>
`;

const buildSimpleTemplate = (
  title: string,
  body: string,
  color: string
): string => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <h2 style="color: ${color};">${title}</h2>
  ${body}
  <br/>
  <p><strong>FinLend Security Team</strong></p>
</div>
`;

/* =====================================================
   EXPORTED EMAIL FUNCTIONS
===================================================== */

// Registration OTP
export const sendEmailOtp = async (email: string, otp: string): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'Verify your FinLend Account',
    html: buildOtpTemplate(
      'Account Verification',
      'Your One-Time Password (OTP) for registration is:',
      otp,
      '#4CAF50'
    ),
  });
};

// Password Reset OTP
export const sendPasswordResetEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'Password Reset Request',
    html: buildOtpTemplate(
      'Password Reset',
      'Use the OTP below to reset your password:',
      otp,
      '#FF5722'
    ),
  });
};

// Registration Success
export const sendRegistrationSuccessEmail = async (
  email: string,
  name: string
): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'Welcome to FinLend 🎉',
    html: buildSimpleTemplate(
      'Registration Successful',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Your account has been successfully verified.</p>
       <p><strong>Security Tip:</strong> We never ask for your password.</p>`,
      '#4CAF50'
    ),
  });
};

// Login Alert
export const sendLoginAlertEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const time = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });

  await sendMail({
    to: email,
    subject: 'New Login Alert',
    html: buildSimpleTemplate(
      'New Login Detected',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Your account was accessed at <strong>${time}</strong> (IST).</p>
       <p>If this was not you, reset your password immediately.</p>`,
      '#2196F3'
    ),
  });
};

// Password Reset Success
export const sendPasswordResetSuccessEmail = async (
  email: string
): Promise<void> => {
  await sendMail({
    to: email,
    subject: 'Password Reset Successful 🔒',
    html: buildSimpleTemplate(
      'Password Changed Successfully',
      `<p>Your password has been successfully updated.</p>
       <p>If this wasn’t you, contact support immediately.</p>`,
      '#FF9800'
    ),
  });
};