const express = require('express');
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require('../middlewares/authentication');


// GET /user/{id}
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

// PUT /user/{id}
router.put("/:userId", authMiddleware.loginRequired, userController.updateUser);


module.exports = router;
