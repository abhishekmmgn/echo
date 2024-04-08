import { Router } from "express";
import {
  getAllConversations,
  getConversation,
  createConversation,
  deleteConversation,
} from "../controllers/conversation";

const conversationRouter = Router();

conversationRouter
  .get("/", getAllConversations)
  .post("/", createConversation)
  .get("/conversation", getConversation)
  .delete("/:id", deleteConversation);

export default conversationRouter;
