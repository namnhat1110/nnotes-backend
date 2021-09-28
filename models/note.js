const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = Schema(
  {
    title: { type: String, require: false },
    content: { type: String, require: false },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    tags: [
      { type: String, require: false }
    ],
    isPrivate: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notes = mongoose.model("notes", noteSchema);

module.exports = Notes;
