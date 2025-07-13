import { User } from "./user.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
