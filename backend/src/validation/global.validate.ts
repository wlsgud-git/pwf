import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      let errorField = result.error.issues[0];
      next({
        status: 400,
        path: errorField.path[0],
        msg: errorField.message,
      });
    }

    next();
  };

export const asyncValidate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req[source]);
    if (!result.success) {
      let errorField = result.error.issues[0];
      next({
        status: 400,
        path: errorField.path[0],
        msg: errorField.message,
      });
    }

    next();
  };
