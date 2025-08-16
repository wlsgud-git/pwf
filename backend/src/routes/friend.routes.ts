import express, { Router } from "express";
const router: Router = express.Router();

import { IsAuth, csrfProtection } from "../middleware/auth.middleware";
import { FriendController } from "../controller/friend.controller";
import { asyncValidate, validate } from "../validation/global.validate";
import { FriendSchema } from "../validation/friend.validate";
import { FriendService } from "../service/friend.service";

// 친구 요청
router.post(
  "/request/friend",
  IsAuth,
  csrfProtection,
  validate(FriendSchema.requestFriend),
  FriendService.requestFriend,
  FriendController.requestFriend
);

// 친구 요청 응답
router.post(
  "/request/friend/response",
  IsAuth,
  csrfProtection,
  validate(FriendSchema.requestFriendHandle),
  FriendService.requestFriendHandle,
  FriendController.handleRequestFriend
);

// 친구 검색
router.get(
  "/search/friends/",
  IsAuth,
  csrfProtection,
  validate(FriendSchema.searchFriends, "query"),
  FriendController.searchFriends
);

router.delete("/friend/:nickname", IsAuth, FriendController.deleteFriend);

module.exports = router;
