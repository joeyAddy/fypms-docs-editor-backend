import { configDotenv } from "dotenv";

import { Server } from "socket.io";

import Connection from "./database/db.js";

import {
  getDocument,
  updateDocument,
} from "./controller/document-controller.js";

configDotenv();

const PORT = 9000;

Connection();

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("====================================");
  console.log("connected");
  console.log("====================================");
  socket.on("get-document", async (documentId, commentsWithPositions) => {
    const document = await getDocument(documentId, commentsWithPositions);
    socket.join(documentId);
    socket.emit("load-document", {
      document: document?.data,
      commentsWithPositions,
    });

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data, commentsWithPositions) => {
      await updateDocument(documentId, data, commentsWithPositions);
    });

    socket.on("send-comments", (data) => {
      const { documentId, commentsWithPositions } = data;

      // Broadcast the comments with positions to the specific room (documentId)
      socket.to(documentId).emit("receive-comments", commentsWithPositions);
    });
  });
});
