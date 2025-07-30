import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result } from "express-validator";
import { LoginMessage } from "../types/auth.types";

// 로그인 유저정보 검증
export const streamRoomValidate = [
  //   이메일
  body("room_name")
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage("방 이름은 1~20자 이내여야 합니다"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    if (errors.isEmpty()) return next();

    let { path, msg } = errors.array()[0];
    res.status(400).json({ path, msg });
  },
];
