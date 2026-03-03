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