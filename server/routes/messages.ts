import { Router } from "express";
import { createMessage, deleteMessage } from "../controllers/messages";

const messageRouter = Router();

messageRouter.post("/", createMessage).delete("/:messageId", deleteMessage);

export default messageRouter;
