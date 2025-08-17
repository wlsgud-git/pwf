"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res) => {
    console.log("i am error", err);
    res.status(500).json({ message: "어딘가 문제가 생김" });
};
exports.errorHandler = errorHandler;
