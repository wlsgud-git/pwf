"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.pgClient = exports.redis = void 0;
const pg_1 = __importDefault(require("pg"));
const client_1 = require("@prisma/client");
const env_config_1 = require("./env.config");
const ioredis_1 = __importDefault(require("ioredis"));
exports.redis = new ioredis_1.default({
    host: env_config_1.config.redis.host,
    port: env_config_1.config.redis.port,
});
exports.pgClient = new pg_1.default.Client({
    user: env_config_1.config.database.user,
    password: env_config_1.config.database.password,
    host: env_config_1.config.database.host,
    database: env_config_1.config.database.database,
    port: env_config_1.config.database.port,
});
exports.prisma = new client_1.PrismaClient();
