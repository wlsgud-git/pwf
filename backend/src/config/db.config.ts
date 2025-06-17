import pg from "pg";
import { config } from "./env.config";

import Redis from "ioredis";

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

export const pgClient = new pg.Client({
  user: config.database.user,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: config.database.port,
});
