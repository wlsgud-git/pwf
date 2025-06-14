import { Response } from "express";

interface tokenOptions {
  secure: boolean;
  httpOnly: boolean;
  sameSite: "none" | "strict" | "lax";
  maxAge?: number;
}

export const setCookie = <T>(res: Response, info: T): void => {
  let cookieOptions: tokenOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 3600 * 1000,
  };

  for (let key in info) {
    let value: any = info[key];
    res.cookie(key, value, cookieOptions);
  }
};
