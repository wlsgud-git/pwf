"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisDelete = exports.redisGet = exports.redisSet = void 0;
const db_config_1 = require("../config/db.config");
const redisSet = async (key, value, expire) => {
    try {
        await db_config_1.redis.set(key, value);
        await db_config_1.redis.expire(key, expire);
    }
    catch (err) {
        throw err;
    }
};
exports.redisSet = redisSet;
const redisGet = async (key) => {
    try {
        let code = await db_config_1.redis.get(key);
        return code;
    }
    catch (err) {
        throw err;
    }
};
exports.redisGet = redisGet;
const redisDelete = async (key) => {
    try {
        await db_config_1.redis.del(key);
        return true;
    }
    catch (err) {
        throw err;
    }
};
exports.redisDelete = redisDelete;
