import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const client =
  globalThis.prisma ||
  new PrismaClient({
    transactionOptions: {
      isolationLevel: Prisma.TransactionIsolationLevel?.Serializable,
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["query", "info", "warn", "error"],
  });
if (process.env.NODE_ENV === "production") globalThis.prisma = client;

export default client;

export { Prisma };
