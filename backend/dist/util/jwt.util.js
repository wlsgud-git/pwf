"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.createJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const createJwt = async (payload, type) => {
    try {
        const access_token = await jsonwebtoken_1.default.sign(payload, env_config_1.config.jwt.secret_key, {
            expiresIn: type == "access" ? "10m" : "7d",
        });
        return access_token;
    }
    catch (err) {
        throw err;
    }
};
exports.createJwt = createJwt;
const verifyJwt = async (token) => {
    try {
        const result = await jsonwebtoken_1.default.verify(token, env_config_1.config.jwt.secret_key);
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.verifyJwt = verifyJwt;
