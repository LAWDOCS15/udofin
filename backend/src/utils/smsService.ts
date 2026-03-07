import twilio, { Twilio } from 'twilio';

  //  ENV VARIABLES

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  NODE_ENV,
} = process.env;

  //  TWILIO CLIENT (Singleton)

let twilioClient: Twilio | null = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

  //  UTILITIES

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

  //  CORE SMS FUNCTION

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

  //  EXPORTED OTP FUNCTION

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