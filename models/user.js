
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        notes: [
            {
                type: Schema.Types.ObjectId,
                ref: "notes",
            },
        ],
    },
    { timestamps: true }
);

userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    return accessToken;
};

const Users = mongoose.model("users", userSchema);

module.exports = Users