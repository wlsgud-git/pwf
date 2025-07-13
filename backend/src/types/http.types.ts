import { Request, Response, NextFunction } from "express";
import { User } from "./user.types";

export interface corsProps {
  credentials: boolean;
  optionsSuccessStatus: number;
  origin: string;
}

export interface HttpRequest {
  headers?: HttpHeaders;
  body?: FormData;
  method: string;
}

interface AuthencateRequest extends Request {
  user?: User;
}

export type AuthRequest = (
  req: AuthencateRequest,
  res: Response,
  next: NextFunction
) => void;

export interface RequestQuery<T> {
  (
    req: Request<{}, {}, {}, T>,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface HttpHeaders {
  [key: string]: any;
}
