import express, { type Express } from "express";
import { PrismaClient } from "@prisma/client";
import { PORT, CORS_PORT, CORS_SERVER } from "./secrets";
import currentUserRouter from "./routes/current_user";
import bodyParser from "body-parser";
import cors from "cors";
import contactRouter from "./routes/contacts";
import conversationRouter from "./routes/conversations";
import messageRouter from "./routes/messages";
import { Server } from "socket.io";

export const prisma = new PrismaClient();

const app: Express = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? CORS_SERVER
        : `http://localhost:${CORS_PORT}`,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/current_user", currentUserRouter);
app.use("/contacts", contactRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);

const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? CORS_SERVER
        : `http://localhost:${CORS_PORT}`,
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected.`);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", data);
  });
  socket.on("newConversation", (data) => {
    console.log(data);
    io.emit("newConversation", data);
  });
  socket.on("activity", (data) => {
    console.log(data);
    socket.broadcast.emit("activity", `User ${socket.id} is typing`);
  });
});
