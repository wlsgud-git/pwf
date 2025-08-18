import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { config } from "./env.config";

import Redis from "ioredis";

export const redis = new Redis({
  host: config.redis.host,
});

export const pgClient = new pg.Client({
  user: config.database.user,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: config.database.port,
});

export const prisma = new PrismaClient();
