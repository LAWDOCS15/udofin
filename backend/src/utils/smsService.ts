// import twilio from 'twilio';

// export const sendSmsOtp = async (phoneNumber: string, otp: string): Promise<void> => {
//   try {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

//     //  DEVELOPMENT MODE: If Twilio keys are not present in .env, it will print in terminal
//     if (!accountSid || !authToken || !twilioPhoneNumber) {
//       console.log(`\n📱 ===== MOCK SMS ALERT ===== 📱`);
//       console.log(`To: ${phoneNumber}`);
//       console.log(`Message: Your FinLend login OTP is: ${otp}. Do not share this with anyone.`);
//       console.log(`==============================\n`);
//       return;
//     }

//     //  PRODUCTION MODE: Sends real SMS
//     const client = twilio(accountSid, authToken);

//     // Ensure phone number has country code (For India, +91 is added by default if missing)
//     const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

//     await client.messages.create({
//       body: `Your FinLend login OTP is: ${otp}. Do not share this with anyone.`,
//       from: twilioPhoneNumber,
//       to: formattedNumber,
//     });

//     console.log(`✅ SMS OTP sent successfully to ${formattedNumber}`);
//   } catch (error) {
//     console.error('❌ Error sending SMS OTP:', error);
//     // We are not throwing the error here so that if SMS fails, Email OTP can still work
//   }
// };



import twilio, { Twilio } from 'twilio';

/* =====================================================
   ENV VARIABLES
===================================================== */

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  NODE_ENV,
} = process.env;

/* =====================================================
   TWILIO CLIENT (Singleton)
===================================================== */

let twilioClient: Twilio | null = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

/* =====================================================
   UTILITIES
===================================================== */

// Normalize phone number (Default India +91)
const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }

  // Default country code India
  return `+91${cleaned}`;
};

interface SendSmsOptions {
  to: string;
  message: string;
}

/* =====================================================
   CORE SMS FUNCTION
===================================================== */

const sendSms = async ({ to, message }: SendSmsOptions): Promise<void> => {
  try {
    const formattedNumber = formatPhoneNumber(to);

    // DEV MODE FALLBACK
    if (!twilioClient || !TWILIO_PHONE_NUMBER) {
      if (NODE_ENV !== 'production') {
        console.log('\n📱 ===== MOCK SMS =====');
        console.log(`To: ${formattedNumber}`);
        console.log(`Message: ${message}`);
        console.log('======================\n');
      }
      return;
    }

    await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

  } catch (error) {
    console.error('SMS sending failed:', error);

    // Do not throw → so email fallback works
  }
};

/* =====================================================
   EXPORTED OTP FUNCTION
===================================================== */

export const sendSmsOtp = async (
  phoneNumber: string,
  otp: string
): Promise<void> => {
  const message = `Your FinLend login OTP is: ${otp}. Do not share this with anyone. Valid for 5 minutes.`;

  await sendSms({
    to: phoneNumber,
    message,
  });
};