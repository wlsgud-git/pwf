import express, { Router } from "express";

// middleware

// controller
import { StreamController } from "../controller/streamRoom.controller";
import { csrfProtection, IsAuth } from "../middleware/auth.middleware";
import { StreamSchema } from "../validation/streamroom.validate";
import { validate } from "../validation/global.validate";

// import { loginValidate, signupUserValidate } from "../validation/auth";

const router: Router = express.Router();

//  authentication  Or  authorization
router.get("/room/:id", IsAuth, StreamController.getRoom);

router.post(
  "/room",
  IsAuth,
  csrfProtection,
  validate(StreamSchema.create),
  StreamController.createRoom
);

router.post(
  "/room/token",
  IsAuth,
  csrfProtection,
  StreamController.roomAccessToken
);

router.post(
  "/room/invite",
  IsAuth,
  csrfProtection,
  validate(StreamSchema.invite),
  StreamController.inviteRoom
);

module.exports = router;
