import { pgClient } from "../config/db.config";

pgClient.connect();

export async function dbPlay<T>(query: string, info: any[]): Promise<T[]> {
  try {
    let data = await pgClient.query(query, info);
    return data.rows;
  } catch (err) {
    throw err;
  }
}
