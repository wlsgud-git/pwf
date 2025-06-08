import jwt from "jsonwebtoken";

import { config } from "../../config";

export const createJwt = async (
  payload: object,
  type: "access" | "refresh"
) => {
  try {
    const access_token = await jwt.sign(payload, config.jwt.secret_key, {
      expiresIn: type == "access" ? "10m" : "7d",
    });
    return access_token;
  } catch (err) {
    throw err;
  }
};

export const verifyJwt = async (token: string) => {
  try {
    const result = await jwt.verify(token, config.jwt.secret_key);
    return result;
  } catch (err) {
    throw err;
  }
};
