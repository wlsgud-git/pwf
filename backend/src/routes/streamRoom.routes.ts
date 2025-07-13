import express, { Router } from "express";

// middleware

// controller
import {
  createRoom,
  getRoom,
  inviteRoom,
  roomAccessToken,
} from "../controller/streamRoom.controller";
import { streamRoomValidate } from "../validation/streamroom.validate";
import { csrfProtection, IsAuth } from "../middleware/auth.middleware";

// import { loginValidate, signupUserValidate } from "../validation/auth";

const router: Router = express.Router();

//  authentication  Or  authorization
router.get("/room/:id", IsAuth, getRoom);
router.post("/room", IsAuth, csrfProtection, streamRoomValidate, createRoom);
router.post("/room/token", IsAuth, csrfProtection, roomAccessToken);
router.post("/room/invite", IsAuth, csrfProtection, inviteRoom);

module.exports = router;
