"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3FileDelete = exports.s3FileUpload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const aws_config_1 = require("../config/aws.config");
const s3FileUpload = async (data) => {
    try {
        const param = {
            Key: data["key"],
            Bucket: data["bucket"],
            Body: data["file"].buffer,
            ContentType: data["file"].mimetype,
            // CacheControl: "public, max-age=900",
        };
        const command = new client_s3_1.PutObjectCommand(param);
        await aws_config_1.AWS_s3.send(command);
        const url = await (0, s3_request_presigner_1.getSignedUrl)(aws_config_1.AWS_s3, command);
        return url.split("?")[0];
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.s3FileUpload = s3FileUpload;
const s3FileDelete = async (data) => {
    try {
        const param = {
            Key: data["key"],
            Bucket: data["bucket"],
        };
        const command = new client_s3_1.DeleteObjectCommand(param);
        await aws_config_1.AWS_s3.send(command);
        return;
    }
    catch (err) {
        throw err;
    }
};
exports.s3FileDelete = s3FileDelete;
