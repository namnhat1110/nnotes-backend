const utilsHelper = require("../helpers/utils.helper");
const Users = require("../models/user");
const userController = {};

// userController.getUser = async (req, res, next) => {
//     try {
//         const userId = req.params.userId;
//         const user = await Users.findById(userId)

//         utilsHelper.sendResponse(
//             res,
//             200,
//             true,
//             { user },
//             null,
//             "Get detail of single user"
//         );
//     } catch (error) {
//         next(error);
//     }
// };

userController.getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await Users.findById(userId)

        utilsHelper.sendResponse(
            res,
            200,
            true,
            { user },
            null,
            "Get detail of single user"
        );
    } catch (error) {
        next(error);
    }
}

userController.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { username, email, password } = req.body;

        const user = await Users.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                password
            },
            {
                new: true,
            }
        );
        if (!user) {
            return next(new Error("User not found"));
        }

        utilsHelper.sendResponse(
            res,
            200,
            true,
            { user },
            null,
            "User info updated"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = userController;
