const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth.controller");


// POST /users/signup
router.post("/signup", authController.signup);

// POST /users/login
router.post("/login", authController.login
);

// POST /users/logout
router.post("/logout", authController.logout);


module.exports = router;
