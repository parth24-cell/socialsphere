import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { sendVerificationOTP } from "@/actions/auth-v2";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { email, password, username, name } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { profile: { username } }],
      },
      include: { profile: true }
    });

    if (existingUser) {
      if (existingUser.email === email && existingUser.status === "PENDING") {
        // User exists but is pending, resend OTP
        await sendVerificationOTP(existingUser.email);
        return NextResponse.json({ message: "User pending verification", userId: existingUser.id, pending: true }, { status: 200 });
      }
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        status: "PENDING",
        profile: {
          create: {
            username,
            displayName: name,
          },
        },
      },
    });

    // Send OTP
    const otpResult = await sendVerificationOTP(user.email);
    
    if (!otpResult.success) {
      return NextResponse.json({ message: "User created but failed to send verification email.", userId: user.id }, { status: 500 });
    }

    return NextResponse.json({ message: "Verification required", userId: user.id, pending: true }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
