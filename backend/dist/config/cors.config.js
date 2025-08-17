"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOption = void 0;
const env_config_1 = require("./env.config");
exports.corsOption = {
    credentials: true,
    optionsSuccessStatus: 200,
    origin: env_config_1.config.https.host,
    // methods: ["get", "post"],
};
