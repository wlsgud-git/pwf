import express, { Router } from "express";
const router: Router = express.Router();

import { IsAuth, csrfProtection } from "../middleware/auth.middleware";
import { FriendController } from "../controller/friend.controller";
import { validate } from "../validation/global.validate";
import { FriendSchema } from "../validation/friend.validate";

router.post(
  "/request/friend",
  IsAuth,
  csrfProtection,
  FriendController.requestFriend
);

router.post(
  "/request/friend/response",
  IsAuth,
  csrfProtection,
  FriendController.handleRequestFriend
);

router.get(
  "/search/friends/",
  IsAuth,
  csrfProtection,
  validate(FriendSchema.searchFriends),
  FriendController.searchFriends
);

router.delete("/friend/:nickname", IsAuth, FriendController.deleteFriend);

module.exports = router;
