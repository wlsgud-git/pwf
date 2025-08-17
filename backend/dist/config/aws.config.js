"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_config_1 = require("./env.config");
exports.AWS_s3 = new client_s3_1.S3Client({
    region: env_config_1.config.aws.region,
    credentials: {
        accessKeyId: env_config_1.config.aws.access_key,
        secretAccessKey: env_config_1.config.aws.secret_key,
    },
});
