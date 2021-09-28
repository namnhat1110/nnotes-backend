const mongoose = require("mongoose");
const { filterFields } = require("../helpers/utils.helper");
const utilsHelper = require("../helpers/utils.helper");

const Notes = require("../models/note");
const Users = require("../models/user");

const notesController = {};

notesController.getNotes = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { search } = { ...req.query };
    // let notes;
    // let totalNotes;

    // if (search) {
    //   totalNotes = await Notes.find({
    //     title: { $regex: new RegExp(search, "i") },
    //     isDeleted: false,
    //     author: mongoose.Types.ObjectId(userId),
    //   }).countDocuments();

    //   notes = await Notes.find({
    //     title: { $regex: new RegExp(search, "i") },
    //     isDeleted: false,
    //     author: mongoose.Types.ObjectId(userId),
    //   });
    // } else {
    //   notes = await Notes.find({
    //     isDeleted: false,
    //     author: mongoose.Types.ObjectId(userId),
    //   });
    // }
    const filter = {
      isDeleted: false,
      author: mongoose.Types.ObjectId(userId),
    };
    if (search) {
      filter.title = { $regex: new RegExp(search, "i") };
    }
    const totalNotes = await Notes.countDocuments(filter);
    const notes = await Notes.find(filter);
    utilsHelper.sendResponse(res, 200, true, { notes }, null, "Notes found");
  } catch (error) {
    next(error);
  }
};

// notesController.getSearchedNotes = async (req, res, next) => {
//   try {
//     const userId = req.userId;

//     const query = {};
//     if (req.query.search) {
//       query.title = {
//         $regex: req.query.search,
//         $options: "i",
//       };
//     }

//     const notes = await Notes.find(query);
//     utilsHelper.sendResponse(res, 200, true, { notes }, null, "Notes found");
//   } catch (error) {
//     next(error);
//   }
// };

notesController.getCollabNotes = async (req, res, next) => {
  try {
    const userId = req.userId;
    let { search } = { ...req.query };
    const filter = {
      isDeleted: false,
      collaborators: { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } },
    };
    if (search) {
      filter.title = { $regex: new RegExp(search, "i") };
    }
    const totalNotes = await Notes.countDocuments(filter);
    const notes = await Notes.find(filter);
    utilsHelper.sendResponse(res, 200, true, { notes }, null, "Notes found");
  } catch (error) {
    next(error);
  }
};

notesController.getNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const note = await Notes.findById(noteId);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { note },
      null,
      "Get detail of single note"
    );
  } catch (error) {
    next(error);
  }
};

notesController.createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.userId;

    const note = await Notes.create({
      title,
      content,
      tags: utilsHelper.unique(tags),
      author: userId,
    });

    if (!note) return next(new Error("Create Note unsuccessful"));

    utilsHelper.sendResponse(res, 200, true, { note }, null, "Note created");
  } catch (error) {
    next(error);
  }
};

notesController.putNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags } = req.body;

    const note = await Notes.findByIdAndUpdate(
      noteId,
      {
        title,
        content,
        tags: utilsHelper.unique(tags),
      },
      {
        new: true,
      }
    );
    if (!note) {
      return next(new Error("Update Note unsuccessful"));
    }

    utilsHelper.sendResponse(res, 200, true, { note }, null, "Product updated");
  } catch (error) {
    next(error);
  }
};

notesController.deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.noteId;
    const note = await Notes.findById(noteId);
    if (!note) {
      return next(new Error("Product not found or User not authorized"));
    }
    await Notes.findByIdAndUpdate(noteId, { isDeleted: true }, { new: true });
    utilsHelper.sendResponse(res, 200, true, null, null, "Product deleted");
  } catch (error) {
    next(error);
  }
};

notesController.inviteCollaborator = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { email, noteId } = req.body;

    const collaborator = await Users.findOne({ email });
    if (!collaborator) return next(new Error("Collaborator not found"));

    const note = await Notes.findById(noteId);
    if (!note) return next(new Error("Note not found"));

    // if (!note.author.equals(userId))
    //   return next(new Error("Only Author can share note"));

    if (note.collaborators.includes(collaborator._id))
      return next(new Error("Note has been already shared to this user"));

    const updatedNote = await Notes.findByIdAndUpdate(
      noteId,
      {
        $push: {
          collaborators: collaborator._id,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedNote) {
      return next(new Error("Update Note unsuccessfully"));
    }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { updatedNote },
      null,
      "Collaborator invited"
    );
  } catch (error) {
    next(error);
  }
};

notesController.getAllTags = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notes = await Notes.find({ author: mongoose.Types.ObjectId(userId) });

    const allTags = notes.reduce(
      (acc, note) => (note.tags ? acc.concat(note.tags) : acc),
      []
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { tags: utilsHelper.unique(allTags) },
      null,
      "Tags found"
    );
  } catch (error) {
    next(error);
  }
};

notesController.getAllCollabTags = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notes = await Notes.find({
      collaborators: { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } },
    });

    const allTags = notes.reduce(
      (acc, note) => (note.tags ? acc.concat(note.tags) : acc),
      []
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { tags: utilsHelper.unique(allTags) },
      null,
      "Tags found"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = notesController;
