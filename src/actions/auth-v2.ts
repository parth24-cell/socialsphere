"use server";

import { prisma } from "@/lib/prisma";
import { generateOTP, hashOTP, verifyOTP } from "@/lib/otp";
import {
  sendOTPVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
} from "@/lib/email";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { usernameSchema } from "@/lib/validation";
import { isEmailVerificationSkipped } from "@/lib/environment";

export async function checkUsernameAvailability(username: string) {
  try {
    usernameSchema.parse(username);
  } catch (e: any) {
    return { available: false, error: e.errors?.[0]?.message || "Invalid username" };
  }

  const existing = await prisma.profile.findUnique({
    where: { username: username.toLowerCase() },
  });

  return { available: !existing };
}

export async function checkEmailAvailability(email: string) {
  if (!z.string().email().safeParse(email).success) {
    return { available: false, error: "Invalid email" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  return { available: !existing };
}

export async function sendVerificationOTP(identifier: string) {
  if (isEmailVerificationSkipped()) return { success: true };


  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier.toLowerCase() }, { id: identifier }] }
  });
  if (!user) return { success: false, error: "User not found" };
  const userId = user.id;
  const email = user.email;

  const existingRecords = await prisma.emailVerification.findMany({
    where: { userId },
  });
  
  if (existingRecords.length > 0) {
    const record = existingRecords[0];
    
    // Check cooldown
    if (record.lastResentAt) {
      const secondsSinceLast = (new Date().getTime() - record.lastResentAt.getTime()) / 1000;
      if (secondsSinceLast < 60) {
        return { success: false, error: `Please wait ${Math.ceil(60 - secondsSinceLast)} seconds before resending.` };
      }
    }
    
    // Check max resends
    if (record.resends >= 3) {
      return { success: false, error: "Maximum resend attempts reached. Please contact support." };
    }
    
    // Delete old record
    await prisma.emailVerification.deleteMany({ where: { userId } });
  }

  const otp = generateOTP();
  const hashedToken = await hashOTP(otp);
  
  const userProfile = await prisma.profile.findUnique({ where: { userId }});
  
  await prisma.emailVerification.create({
    data: {
      userId,
      email,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      resends: existingRecords.length > 0 ? existingRecords[0].resends + 1 : 0,
      lastResentAt: new Date(),
    },
  });

  const sendResult = await sendOTPVerificationEmail(email, userProfile?.username || "User", otp);
  
  if (!sendResult.success) {
    return { success: false, error: "Failed to send email. Please try again later." };
  }
  
  return { success: true };
}

export async function verifyUserOTP(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { success: false, error: "User not found" };
  const userId = user.id;

  const record = await prisma.emailVerification.findFirst({
    where: { userId },
  });

  if (!record) {
    return { success: false, error: "No verification pending." };
  }

  if (record.attempts >= 5) {
    return { success: false, error: "Maximum verification attempts reached. Please request a new code." };
  }

  if (record.expiresAt < new Date()) {
    return { success: false, error: "OTP has expired. Please request a new code." };
  }

  // Increment attempts
  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { attempts: record.attempts + 1 },
  });

  const isValid = await verifyOTP(otp, record.token);

  if (!isValid) {
    return { success: false, error: "Invalid verification code." };
  }

  // Success!
  await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" },
  });

  await prisma.emailVerification.update({
    where: { id: record.id },
    data: { verifiedAt: new Date() },
  });
  
  const userProfile = await prisma.profile.findUnique({ where: { userId }});
  if (userProfile) {
    await sendWelcomeEmail(record.email, userProfile.username);
  }

  return { success: true };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { profile: true } });
  if (!user) {
    // For security, always return success even if email not found
    return { success: true };
  }

  const token = generateOTP();
  const hashedToken = await hashOTP(token);
  
  await prisma.passwordReset.deleteMany({ where: { userId: user.id } }); // Clear previous
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    }
  });

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
  
  await sendPasswordResetEmail(user.email, user.profile?.username || "User", resetLink);
  
  return { success: true };
}

export async function executePasswordReset(email: string, token: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { success: false, error: "Invalid request." };

  const resetRecord = await prisma.passwordReset.findFirst({
    where: { userId: user.id, usedAt: null },
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    return { success: false, error: "Link expired or invalid." };
  }

  const isValid = await verifyOTP(token, resetRecord.token);
  if (!isValid) return { success: false, error: "Invalid reset token." };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}
