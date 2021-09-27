const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Users = require("../models/user");

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) return next(new Error("401 - Access Token required"));
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("401 - Token expired"));
        } else {
          return next(new Error("401 - Token is invalid"));
        }
      }

      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
