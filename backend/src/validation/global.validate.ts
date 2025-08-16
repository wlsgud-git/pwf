import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

import { AuthencateRequest } from "../types/http.types";
import { User } from "../types/user.types";

// type Source = "body" | "query" | "params" = "body"

export function validate(
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
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
}

export function asyncValidate<T>(
  schema: (user: User) => ZodSchema<T>,
  source: "body" | "query" | "params" = "body"
) {
  return async (req: AuthencateRequest, res: Response, next: NextFunction) => {
    const sc = await schema(req.user!);

    try {
      const result = await sc.safeParseAsync(req[source]);
      if (!result.success) {
        let errorField = result.error.issues[0];
        next({
          status: 400,
          path: errorField.path[0],
          msg: errorField.message,
        });
      }

      next();
    } catch (err) {
      console.log(err);
    }

    // test();
  };
}
