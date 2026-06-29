import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    let username = body.username;

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    username = username.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { profile: { username } }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            username,
            displayName: username,
          },
        },
      },
    });

    return NextResponse.json({ message: "User created successfully", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
