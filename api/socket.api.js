const socket_io = require("socket.io");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const Users = require("../models/user");
const Comments = require("../models/comment");
const Notes = require("../models/note");

const io = socket_io();
const socketApi = {};
let onlineUsers = {};
const socketTypes = {
  NOTIFICATION: "NOTIFICATION",
  ERROR: "ERROR",
  MSG_INIT: "MESSAGE_INIT",
  MSG_SEND: "MESSAGE_SEND",
  MSG_RECEIVE: "MESSAGE_RECEIVE",
  NOTE_UPDATE: "NOTE_UPDATE",
};

io.use((socket, next) => {
  try {
    const tokenString = socket.handshake.query.accessToken;
    if (!tokenString) return next(new Error("401 - Access Token required"));
    const token = tokenString.replace("Bearer ", "");
    console.log("socket auth", token);

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("401 - Token expired"));
        } else {
          return next(new Error("401 - Token is invalid"));
        }
      }

      socket.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", async function (socket) {
  onlineUsers[socket.userId] = socket.id;
  console.log("Connected", socket.userId);

  socket.on(socketTypes.MSG_INIT, async (msg) => {
    try {
      if (msg?.noteId) {
        const note = await Notes.findById(msg.noteId);
        const comments = await Comments.find({ note: msg.noteId }, "-createdAt")
          .limit(100)
          .sort({ _id: 1 })
          .populate("author");
        const toUsers = [
          note.author.toString(),
          ...note.collaborators.map((id) => id.toString()),
        ];

        toUsers.forEach((userId) => {
          if (onlineUsers[userId]) {
            io.to(onlineUsers[userId]).emit(socketTypes.NOTIFICATION, {
              onlineUsers: Object.keys(onlineUsers),
              comments,
            });
            // console.log(onlineUsers[userId]);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(socketTypes.MSG_SEND, async (msg) => {
    try {
      if (msg.body) {
        let comment = await Comments.create({
          body: msg.body,
          author: msg.from,
          note: msg.noteId,
        });
        comment = await Comments.populate(comment, { path: "author" });

        const note = await Notes.findById(msg.noteId);
        const toUsers = [
          note.author.toString(),
          ...note.collaborators.map((id) => id.toString()),
        ];
        toUsers.forEach((userId) => {
          if (onlineUsers[userId]) {
            io.to(onlineUsers[userId]).emit(socketTypes.NOTIFICATION, {
              newComment: comment,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(socketTypes.NOTE_UPDATE, async (msg) => {
    try {
      if (msg.noteId) {
        console.log(msg.noteId);
        const note = await Notes.findById(msg.noteId);
        const toUsers = [
          note.author.toString(),
          ...note.collaborators.map((id) => id.toString()),
        ];
        toUsers.forEach((userId) => {
          if (onlineUsers[userId]) {
            io.to(onlineUsers[userId]).emit(socketTypes.NOTIFICATION, {
              updatedNote: note,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("error", (error) => {
    console.log(error);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected", socket.userId);
    delete onlineUsers[socket.userId];
    console.log("Number of users", Object.keys(onlineUsers).length);
  });
});

socketApi.io = io;
module.exports = socketApi;
