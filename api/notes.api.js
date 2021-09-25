const express = require('express');
const router = express.Router();
const notesController = require("../controllers/note.controller");
const authMiddleware = require('../middlewares/authentication');


// GET /notes
router.get("/", authMiddleware.loginRequired, notesController.getNotes);

// GET /notes
router.get("/collab", authMiddleware.loginRequired, notesController.getCollabNotes);


// GET /notes/{id}
router.get("/:noteId", authMiddleware.loginRequired, notesController.getNote);

// POST /notes
router.post("/", authMiddleware.loginRequired, notesController.createNote);

// PUT /notes/{id}
router.put("/:noteId", authMiddleware.loginRequired, notesController.putNote);

// DELETE /notes/{id}
router.delete("/:noteId", authMiddleware.loginRequired, notesController.deleteNote);


module.exports = router;