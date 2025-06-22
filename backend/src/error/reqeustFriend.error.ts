import { NextFunction } from "express";

export const requestFriendError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
};
