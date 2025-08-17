"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareText = exports.hashingText = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_config_1 = require("../config/env.config");
// 해쉬 완료된 text return
const hashingText = async (text) => {
    try {
        let hashText = await bcrypt_1.default.hash(text, env_config_1.config.secure.salt);
        return hashText;
    }
    catch (err) {
        throw err;
    }
};
exports.hashingText = hashingText;
// 비교 결과 return
const compareText = async (text, hash_text) => {
    try {
        let hashText = await bcrypt_1.default.compare(text, hash_text);
        return hashText;
    }
    catch (err) {
        throw err;
    }
};
exports.compareText = compareText;
