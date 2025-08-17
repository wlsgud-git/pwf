"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key, defaultValue) => {
    let value = process.env[key] || defaultValue;
    if (!value)
        throw new Error("해당 환경변수는 존재하지 않습니다");
    return value;
};
exports.config = {
    https: {
        port: parseInt(required("PORT"), 8443),
        host: required("HOST"),
    },
    database: {
        user: required("DB_USER"),
        password: required("DB_PASSWORD"),
        host: required("DB_HOST"),
        database: required("DB_DATABASE"),
        port: parseInt(required("DB_PORT")),
    },
    socket: {
        client_url: required("SOCKET_CLIENT_URL"),
    },
    aws: {
        region: required("AWS_REGION"),
        access_key: required("AWS_ACCESS_KEY"),
        secret_key: required("AWS_SECRET_KEY"),
        profile_bucket: required("AWS_PROFILE_BUCKET"),
    },
    secure: {
        salt: parseInt(required("SALT")),
    },
    nodemailer: {
        email: required("NODEMAIL_EMAIL"),
        password: required("NODEMAIL_PASSWORD"),
        port: parseInt(required("NODEMAIL_PORT")),
    },
    redis: {
        host: required("REDIS_HOST"),
        port: parseInt(required("REDIS_PORT")),
    },
    session: {
        session_expire: parseInt(required("SESSION_EXPIRE")),
    },
    authcode: {
        expires: parseInt(required("AUTHCODE_EXPIRE")),
    },
    jwt: {
        secret_key: required("JWT_SECRET_KEY"),
        access_expires: required("JWT_ACCESS_EXPIRES"),
        refresh_expires: required("JWT_REFRESH_EXPRIES"),
    },
};
