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
  socket.on("get-document", async (documentId) => {
    await getDocument(documentId).then((document) => {
      socket.join(documentId);
      if (document.data) socket.emit("load-document", document.data);
    });

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});
