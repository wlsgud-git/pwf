"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsOption = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.httpsOption = {
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../cert/key.pem")),
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../cert/cert.pem")),
};
