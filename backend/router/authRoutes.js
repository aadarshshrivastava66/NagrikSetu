const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controller/authController");
const {isLogedIn} =require('../middleware/authmiddleware')

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isLogedIn, getMe);

module.exports = router;