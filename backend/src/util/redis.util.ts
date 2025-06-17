import { redis } from "../config/db.config";

export const redisSet = async (key: string, value: string, expire: number) => {
  try {
    await redis.set(key, value);
    await redis.expire(key, expire);
  } catch (err) {
    throw err;
  }
};

export const redisGet = async (key: string): Promise<string | null> => {
  try {
    let code = await redis.get(key);
    return code;
  } catch (err) {
    throw err;
  }
};

export const redisDelete = async (key: string): Promise<boolean> => {
  try {
    await redis.del(key);
    return true;
  } catch (err) {
    throw err;
  }
};
