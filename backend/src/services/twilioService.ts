import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioPhone = process.env.TWILIO_PHONE_NUMBER || '';

// Determine if we should fall back to mock SMS mode
export const isTwilioMockMode = !(
  accountSid && 
  authToken && 
  twilioPhone && 
  accountSid !== 'your_twilio_account_sid' && 
  authToken !== 'your_twilio_auth_token' && 
  twilioPhone !== 'your_twilio_phone_number'
);

console.log(`[twilioService] Mode: ${isTwilioMockMode ? 'MOCK SMS (Console Log Fallback)' : 'LIVE SMS (Twilio REST API)'}`);

export interface SmsSendResult {
  success: boolean;
  sid?: string;
  error?: string;
  mocked?: boolean;
}

/**
 * Sends an SMS message to a recipient.
 * If live credentials are not set, falls back to a simulated console-logged send.
 * 
 * @param to Recipient's phone number (e.g. +1234567890)
 * @param body SMS message body
 */
export async function sendSms(to: string, body: string): Promise<SmsSendResult> {
  if (!to || !body) {
    return { success: false, error: 'Recipient phone number and message body are required.' };
  }

  if (isTwilioMockMode) {
    console.log('\n--- [MOCK SMS REMINDER SENT] ---');
    console.log(`To: ${to}`);
    console.log(`Message: "${body}"`);
    console.log('--------------------------------\n');
    return {
      success: true,
      sid: 'SMmock_' + Math.random().toString(36).substr(2, 9),
      mocked: true
    };
  }

  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: body,
      from: twilioPhone,
      to: to
    });

    console.log(`[twilioService] Live SMS sent to ${to}. Message SID: ${message.sid}`);
    return {
      success: true,
      sid: message.sid,
      mocked: false
    };
  } catch (error: any) {
    console.error(`[twilioService] Failed to send live SMS to ${to}:`, error.message || error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}
