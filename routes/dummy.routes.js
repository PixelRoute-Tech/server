const express = require("express");
const passport = require("passport");
const router = express.Router();
router.post("/", require("../controllers/dummy.controller").dummyController);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  require("../controllers/dummy.controller").dummyOauthCallback
);
module.exports = router;
