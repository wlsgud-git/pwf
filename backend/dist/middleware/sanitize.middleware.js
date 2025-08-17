"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMiddleware = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const globalSanitize = (obj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] == "string")
                obj[key] = (0, sanitize_html_1.default)(obj[key]);
            else if (typeof obj[key] == "object")
                globalSanitize(obj[key]);
        }
    }
};
const sanitizeMiddleware = (req, res, next) => {
    let sec = ["body", "query", "params"];
    sec.forEach((section) => {
        let ty = req[section];
        globalSanitize(ty);
    });
    next();
};
exports.sanitizeMiddleware = sanitizeMiddleware;
