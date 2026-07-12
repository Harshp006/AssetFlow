import { PrismaClient } from "../generated/prisma";

const prismaGlobal = global as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}

export default prisma;
