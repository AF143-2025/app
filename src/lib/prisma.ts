import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import os from "os";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  const candidateSourcePaths = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
    path.join(__dirname, "dev.db"),
    path.join(__dirname, "..", "prisma", "dev.db"),
    "/var/task/prisma/dev.db",
    "/var/task/dev.db",
  ];

  const sourceDbPath = candidateSourcePaths.find((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });

  if (isServerless && sourceDbPath) {
    const tmpDbPath = path.join(os.tmpdir(), "dev.db");
    try {
      if (!fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
        console.log(`[Prisma] Copied database from ${sourceDbPath} to ${tmpDbPath}`);
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.error("[Prisma] Failed to copy database to tmp:", err);
      return `file:${sourceDbPath}`;
    }
  }

  if (sourceDbPath) {
    return `file:${sourceDbPath}`;
  }

  return "file:./prisma/dev.db";
}

const dbUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

