import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.log("i am error", err);
  res.status(500).json({ message: "어딘가 문제가 생김" });
};
