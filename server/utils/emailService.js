const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

// Lazily initialize Resend to avoid crashes if API key is missing during module load
let resendInstance = null;
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "your_resend_api_key" || apiKey.includes("your_")) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
};

const fromEmail = "onboarding@resend.dev";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * Send Welcome Email
 */
exports.sendWelcomeEmail = async (user) => {
  const resend = getResend();
  
  if (!resend) {
    console.log("-----------------------------------------");
    console.log("DEV MODE: WELCOME EMAIL (No API Key)");
    console.log(`To: ${user.email}`);
    console.log(`Welcome, ${user.name}!`);
    console.log("-----------------------------------------");
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: "Welcome to SDAA!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h1 style="color: #6366f1; margin-bottom: 24px;">Welcome to SDAA, ${user.name}!</h1>
          <p style="color: #4b5563; line-height: 1.6;">We're excited to have you join our Secure Digital Academic Archive. You can now start managing and submitting your assignments with ease.</p>
          <div style="margin: 32px 0; border-top: 1px solid #e5e7eb; padding-top: 24px;">
            <p style="color: #6b7280; font-size: 14px;">If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; text-align: center;">&copy; 2026 SDAA Dashboard</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Welcome Email Error:", error);
      return { success: false, error: error.message || "Failed to send email" };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Email Service Error (Welcome):", err);
    return { success: false, error: err.message };
  }
};

/**
 * Send Password Reset Email
 */
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
  const resend = getResend();

  // If no valid API key, log to console and return success
  if (!resend) {
    console.log("-----------------------------------------");
    console.log("DEV MODE: PASSWORD RESET LINK");
    console.log(`To: ${user.email}`);
    console.log(`Link: ${resetUrl}`);
    console.log("-----------------------------------------");
    return { success: true, devMode: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: "Password Reset Request - SDAA",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p style="color: #4b5563; line-height: 1.6;">You requested a password reset for your SDAA account. Click the button below to set a new password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <p style="color: #9ca3af; font-size: 11px;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #6366f1; font-size: 11px; word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Reset Password Email Error:", error);
      return { success: false, error: error.message || "Failed to send email" };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Email Service Error (Reset):", err);
    return { success: false, error: err.message };
  }
};
