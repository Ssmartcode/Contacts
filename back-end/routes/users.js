const express = require("express");

const router = express.Router();

userController = require("../controllers/users");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;
