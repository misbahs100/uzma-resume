import twilio from "twilio/lib/rest/Twilio";

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const twilioClient = new twilio(accountSid, authToken);

export async function sendSmsNotification(
  toMobile: string,
  message: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    const msg = await twilioClient.messages.create({
      body: message,
      from: twilioPhone,
      to: toMobile,
    });
    return { success: true, sid: msg.sid };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
