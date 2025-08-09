import express, { Router } from "express";

// middleware

// controller
import { StreamController } from "../controller/streamRoom.controller";
import { csrfProtection, IsAuth } from "../middleware/auth.middleware";

// import { loginValidate, signupUserValidate } from "../validation/auth";

const router: Router = express.Router();

//  authentication  Or  authorization
router.get("/room/:id", IsAuth, StreamController.getRoom);

router.post("/room", IsAuth, csrfProtection, StreamController.createRoom);

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
  StreamController.inviteRoom
);

module.exports = router;
