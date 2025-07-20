import AWS, { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_s3 } from "../config/aws.config";

interface S3Props {
  key: string;
  bucket?: string;
  file?: any;
}

export const s3FileUpload = async (data: S3Props) => {
  try {
    const param = {
      Key: data["key"],
      Bucket: data["bucket"],
      Body: data["file"].buffer,
      ContentType: data["file"].mimetype,
      // CacheControl: "public, max-age=900",
    };

    const command = new PutObjectCommand(param);
    await AWS_s3.send(command);

    const url = await getSignedUrl(AWS_s3, command);
    return url.split("?")[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const s3FileDelete = async (data: S3Props) => {
  try {
    const param = {
      Key: data["key"],
      Bucket: data["bucket"],
    };

    const command = new DeleteObjectCommand(param);
    await AWS_s3.send(command);

    return;
  } catch (err) {
    throw err;
  }
};
