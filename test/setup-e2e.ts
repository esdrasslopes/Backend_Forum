import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { DomainEvents } from "@/core/events/domain-events";
import { Redis } from "ioredis";
import { envSchema } from "@/infra/env/env";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

const schemaId = randomUUID();

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASSE_URL environment variable!");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId);

  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync("pnpm prisma db push");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
