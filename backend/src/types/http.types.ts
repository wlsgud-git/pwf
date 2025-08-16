import { Request, Response, NextFunction } from "express";
import { User } from "./user.types";

export interface corsProps {
  credentials: boolean;
  optionsSuccessStatus: number;
  origin: string;
}

export interface AuthencateRequest extends Request {
  user?: User;
}

export type AuthRequest = (
  req: AuthencateRequest,
  res: Response,
  next: NextFunction
) => void;
