const express = require("express");
const router = express.Router();

const userCtlr = require("../controllers/user");

router.post("/signup", userCtlr.signup);
router.post("/login", userCtlr.login);

module.exports = router;
