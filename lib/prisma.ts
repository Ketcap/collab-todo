import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

interface globalThis {
  prisma: PrismaClient;
  pool: Pool;
  adapter: PrismaNeon;
}

const globalForPrisma = global as unknown as globalThis;

if (!globalForPrisma.prisma) {
  // neonConfig.webSocketConstructor = ws;
  const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });
  globalForPrisma.prisma = prisma;
}
export const prisma = globalForPrisma.prisma;
