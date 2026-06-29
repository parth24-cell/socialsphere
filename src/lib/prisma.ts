import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

interface GlobalForPrisma {
  prisma?: PrismaClient;
  pool?: Pool;
}

const globalForPrisma = globalThis as unknown as GlobalForPrisma;

if (!globalForPrisma.prisma) {
  globalForPrisma.pool = new Pool({
    connectionString,
    max: 5, // Keep the connection limit low to avoid exhausting Neon free tier limits
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  const adapter = new PrismaPg(globalForPrisma.pool);
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;

