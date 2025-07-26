import { RequestHandler } from "express";
import sanitizeHtml from "sanitize-html";

type Section = "body" | "query" | "params";

const globalSanitize = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] == "string") obj[key] = sanitizeHtml(obj[key]);
      else if (typeof obj[key] == "object") globalSanitize(obj[key]);
    }
  }
};

export const sanitizeMiddleware: RequestHandler = (req, res, next) => {
  let sec = ["body", "query", "params"] as Section[];
  sec.forEach((section) => {
    let ty = req[section];
    globalSanitize(ty);
  });
  next();
};
