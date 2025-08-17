"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
const setCookie = (res, info) => {
    let cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 3600 * 1000,
    };
    for (let key in info) {
        let value = info[key];
        res.cookie(key, value, cookieOptions);
    }
};
exports.setCookie = setCookie;
