import twilio from 'twilio';

export const sendSmsOtp = async (phoneNumber: string, otp: string): Promise<void> => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    //  DEVELOPMENT MODE: If Twilio keys are not present in .env, it will print in terminal
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.log(`\n📱 ===== MOCK SMS ALERT ===== 📱`);
      console.log(`To: ${phoneNumber}`);
      console.log(`Message: Your FinLend login OTP is: ${otp}. Do not share this with anyone.`);
      console.log(`==============================\n`);
      return;
    }

    //  PRODUCTION MODE: Sends real SMS
    const client = twilio(accountSid, authToken);

    // Ensure phone number has country code (For India, +91 is added by default if missing)
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

    await client.messages.create({
      body: `Your FinLend login OTP is: ${otp}. Do not share this with anyone.`,
      from: twilioPhoneNumber,
      to: formattedNumber,
    });

    console.log(`✅ SMS OTP sent successfully to ${formattedNumber}`);
  } catch (error) {
    console.error('❌ Error sending SMS OTP:', error);
    // We are not throwing the error here so that if SMS fails, Email OTP can still work
  }
};