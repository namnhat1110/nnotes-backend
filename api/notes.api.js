const express = require("express");
const router = express.Router();
const notesController = require("../controllers/note.controller");
const authMiddleware = require("../middlewares/authentication");

// GET /notes
router.get("/", authMiddleware.loginRequired, notesController.getNotes);

// GET /notes/search
router.get("/search", authMiddleware.loginRequired, notesController.getNotes);

// GET /notes
router.get(
  "/collab",
  authMiddleware.loginRequired,
  notesController.getCollabNotes
);

// GET all tags /notes/tags
router.get("/tags", authMiddleware.loginRequired, notesController.getAllTags);

// GET /notes/{id}
router.get("/:noteId", authMiddleware.loginRequired, notesController.getNote);

// POST /notes
router.post("/", authMiddleware.loginRequired, notesController.createNote);

// PUT /notes/{id}
router.put("/:noteId", authMiddleware.loginRequired, notesController.putNote);

// DELETE /notes/{id}
router.delete(
  "/:noteId",
  authMiddleware.loginRequired,
  notesController.deleteNote
);

// POST /notes/invite
// req.body: { email: '...', 'noteId': '...'}
router.post(
  "/invite",
  authMiddleware.loginRequired,
  notesController.inviteCollaborator
);

module.exports = router;
