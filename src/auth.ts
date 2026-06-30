import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier as string;
        
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { profile: { username: identifier.toLowerCase() } }
            ]
          },
          include: { profile: true }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Rate Limiting Check (Brute-force protection)
        const lockoutTime = new Date(Date.now() - 15 * 60 * 1000); // 15 mins
        const failedAttempts = await prisma.authAttempt.count({
          where: {
            userId: user.id,
            success: false,
            createdAt: { gte: lockoutTime }
          }
        });

        if (failedAttempts >= 5) {
          throw new Error("TOO_MANY_ATTEMPTS");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!isPasswordValid) {
          await prisma.authAttempt.create({ data: { userId: user.id, success: false } });
          return null;
        }

        await prisma.authAttempt.create({ data: { userId: user.id, success: true } });

        if (user.status === "PENDING") {
          throw new Error("PENDING_VERIFICATION");
        }
        
        if (user.status === "BANNED" || user.status === "SUSPENDED") {
          throw new Error("ACCOUNT_LOCKED");
        }

        // Login Alert Email Trigger (Async)
        // Note: Real IP/Device needs proper header extraction in Next.js 
        // We'll mock it for now since authorize() doesn't give direct access to next/headers easily in all contexts
        const { sendLoginAlertEmail } = await import("@/lib/email");
        sendLoginAlertEmail(
          user.email,
          user.profile?.username || "User",
          new Date().toLocaleString(),
          "Web Browser",
          "Hidden IP"
        ).catch(console.error);

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
