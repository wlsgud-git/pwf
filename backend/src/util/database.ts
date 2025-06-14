import pg from "pg";
import { config } from "../config/config";

const pgClient = new pg.Client({
  user: config.database.user,
  password: config.database.password,
  host: config.database.host,
  database: config.database.database,
  port: config.database.port,
});

pgClient.connect();

export async function dbPlay<T>(query: string, info: any[]): Promise<T[]> {
  try {
    let data = await pgClient.query(query, info);
    return data.rows;
  } catch (err) {
    throw err;
  }
}
