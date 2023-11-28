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
    console.log("====================================");
    console.log(documentId);
    console.log("====================================");
    const document = await getDocument(documentId);

    socket.join(documentId);
    socket.emit("load-document", document);

    socket.on("send-changes", (text) => {
      console.log("sending changes");
      socket.broadcast.to(documentId).emit("receive-changes", text);
    });

    socket.on("save-document", async (payload) => {
      const { sfdt } = payload;

      await updateDocument(documentId, sfdt);
    });
  });
});
