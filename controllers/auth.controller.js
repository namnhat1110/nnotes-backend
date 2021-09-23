const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const Users = require("../models/user");
const authController = {};

authController.signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await Users.findOne({ email });
        if (existingUser) return next(new Error("401 - Email already exits"));
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt);

        const user = await Users.create({
            email,
            password: newpassword,
            username,
        });
        utilsHelper.sendResponse(
            res,
            200,
            true,
            null,
            null,
            "Register successfully"
        );
    } catch (err) {
        next(err);
    }
};

authController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) return next(new Error("401 - Email not exists"));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(new Error("401 - Wrong password"));

        const accessToken = await user.generateToken();
        utilsHelper.sendResponse(
            res,
            200,
            true,
            { user, accessToken },
            null,
            "Login success"
        );
    } catch (err) {
        next(err);
    }
};

authController.logout = (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
        const err = new Error("User is not authenticated.");
        err.statusCode = 401;
        throw err;
    }

    res.clearCookie("token", { domain: process.env.DOMAIN });
    res.status(200).json({
        message: "User successfully logged out.",
        userId: userId,
    });
};


module.exports = authController;
