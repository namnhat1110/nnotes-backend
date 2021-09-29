const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    body: { type: String, require: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "notes",
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("comments", commentSchema);

module.exports = Notes;
