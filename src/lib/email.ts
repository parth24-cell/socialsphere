import { Resend } from "resend";
import OTPVerificationEmail from "./email/templates/OTPVerificationEmail";
import WelcomeEmail from "./email/templates/WelcomeEmail";
import PasswordResetEmail from "./email/templates/PasswordResetEmail";
import LoginAlertEmail from "./email/templates/LoginAlertEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const FROM_EMAIL = process.env.NODE_ENV === "production" ? "SocialSphere <onboarding@resend.dev>" : "SocialSphere <onboarding@resend.dev>"; // Update with verified domain when available
export async function sendOTPVerificationEmail(
  to: string,
  username: string,
  otp: string
) {
  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Mock sending OTP: ${otp} to ${to}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your SocialSphere Account",
      react: React.createElement(OTPVerificationEmail, { otp, username }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, username: string) {
  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Mock sending Welcome to ${to}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to SocialSphere! 🎉",
      react: React.createElement(WelcomeEmail, { username }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Welcome email:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  username: string,
  resetLink: string
) {
  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Mock sending Password Reset: ${resetLink} to ${to}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your SocialSphere Password",
      react: React.createElement(PasswordResetEmail, { resetLink, username }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Password Reset email:", error);
    return { success: false, error };
  }
}

export async function sendLoginAlertEmail(
  to: string,
  username: string,
  time: string,
  deviceInfo: string,
  ipAddress: string
) {
  if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] Mock sending Login Alert to ${to}`);
    return { success: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "New Login to your SocialSphere Account",
      react: React.createElement(LoginAlertEmail, {
        username,
        time,
        deviceInfo,
        ipAddress,
      }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send Login Alert email:", error);
    return { success: false, error };
  }
}
