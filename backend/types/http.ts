import { Request, Response, NextFunction } from "express";

export interface corsProps {
  credentials: boolean;
  optionsSuccessStatus: number;
  origin: string;
}

export interface requestHandler {}

export type ExpressHandler<T = any, U = any> = (
  req: Request<T>,
  res: Response<U>
) => void;

export interface HttpResponse<T> {
  status?: number;
  data: T | undefined;
}

export interface HttpRequest {
  headers?: HttpHeaders;
  body?: FormData;
  method: string;
}

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
