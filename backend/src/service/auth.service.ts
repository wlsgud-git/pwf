import { AuthData } from "../data/auth.data";
import { ControllerProps } from "../types/control.types";

export const AuthService: ControllerProps = {
  signup: async (req, res, next) => {
    let { email, nickname } = req.body;
    try {
      // 이메일
      await AuthData.emailOverlap(email);
      //   닉네임
      await AuthData.nicknameOverlap(nickname);
      next();
    } catch (err) {
      next(err);
    }
  },
};
