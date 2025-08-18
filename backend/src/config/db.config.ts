import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { config } from "./env.config";

import Redis from "ioredis";

export const redis = new Redis(config.redis.host as string, {
  tls: {
    rejectUnauthorized: false,
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis connected error:", err);
});

export const pgClient = new pg.Client({
  user: config.database.user,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: config.database.port,
});

export const prisma = new PrismaClient();
