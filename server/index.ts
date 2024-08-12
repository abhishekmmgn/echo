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

const uidToSocketIds: Map<string, string> = new Map();
const conversationRooms: {
  roomId: string;
  activeUsers: number;
}[] = [];
const callRooms: {
  createdBy: string;
  roomId: string;
  users: string[]; // not active users
  usersCount: number; // not active users
  activeUsers: number;
}[] = [];

function findRoomIndex(roomId: string): number {
  return conversationRooms.findIndex((room) => room.roomId === roomId);
}

io.on("connection", (socket) => {
  socket.on("setId", (userId) => {
    uidToSocketIds.set(userId, socket.id);
  });
  socket.on("removeId", (userId) => {
    uidToSocketIds.delete(userId);
  });

  socket.on("join-room", (conversationId) => {
    const index = findRoomIndex(conversationId);

    if (index === -1) {
      // create a new room
      const roomId = conversationId;
      conversationRooms.push({
        roomId,
        activeUsers: 1,
      });
      socket.join(roomId);
    } else {
      // join an existing room
      const roomId = conversationRooms[index].roomId;
      socket.join(roomId);
      conversationRooms[index].activeUsers++;
    }
  });
  socket.on("leave-room", (conversationId) => {
    const index = findRoomIndex(conversationId);
    if (index !== -1) {
      if (conversationRooms[index].activeUsers > 1) {
        conversationRooms[index].activeUsers--;
      } else {
        conversationRooms.splice(index, 1);
      }
    }
  });

  socket.on("send-activity", (conversationId) => {
    const index = findRoomIndex(conversationId);
    if (index !== -1) {
      socket.to(conversationRooms[index].roomId).emit("show-activity");
    }
  });
  socket.on("send-message", ({ conversationId, message }) => {
    socket.to(conversationId).emit("show-message", message);
  });
  socket.on(
    "outgoing:call",
    (data: {
      userId: string;
      avatar: string | null;
      name: string;
      offer: RTCSessionDescriptionInit;
      conversationId: string;
      participants: string[];
    }) => {
      socket.join(data.conversationId);
      callRooms.push({
        createdBy: data.userId,
        roomId: data.conversationId,
        users: data.participants,
        usersCount: data.participants.length,
        activeUsers: 1,
      });
      data.participants.map((participant: string) => {
        const socketId = uidToSocketIds.get(participant);
        if (socketId && participant !== data.userId) {
          socket.to(socketId).emit("incomming:call", {
            avatar: data.avatar,
            name: data.name,
            conversationId: data.conversationId,
            offer: data.offer,
          });
        }
      });
    }
  );
  socket.on("call:cancelled", (roomId) => {
    const index = callRooms.findIndex((room) => room.roomId === roomId);
    if (index !== -1) {
      console.log("Call cancelled.", callRooms[index].users);
      callRooms[index].users.map((user: string) => {
        const socketId = uidToSocketIds.get(user);
        if (socketId) {
          socket.to(socketId).emit("cancelled:call");
        }
      });
      callRooms.splice(index, 1);
    }
  });
  socket.on("call:accepted", ({ userId, roomId, answer }) => {
    const index = callRooms.findIndex((room) => room.roomId === roomId);

    if (index !== -1) {
      callRooms[index].users.push(userId);
      socket.join(roomId); // A user joined, now start webRTC
      callRooms[index].activeUsers++;
      // send answer to the creator
      callRooms[index].users.map((user: string) => {
        const socketId = uidToSocketIds.get(user);
        if (socketId) {
          socket.to(socketId).emit("answered:call", {
            roomId,
            answer,
          });
        }
      });
    }
  });

  socket.on("call:declined", ({ userId, roomId }) => {
    const index = callRooms.findIndex((room) => room.roomId === roomId);
    if (index !== -1) {
      if (callRooms[index].usersCount === 2) {
        // private call, person declined the call
        console.log("Call declined");
        const socketId = uidToSocketIds.get(callRooms[index].createdBy);
        if (socketId) {
          socket.to(socketId).emit("declined:call");
        }
        callRooms.splice(index, 1);
      } else {
        // Remove the user which declined the call
        callRooms[index].users = callRooms[index].users.filter(
          (user) => user !== userId
        );
        callRooms[index].usersCount = callRooms[index].usersCount - 1;
      }
      console.log(callRooms[index]);
    }
  });

  socket.on("disconnect", () => {});
});
