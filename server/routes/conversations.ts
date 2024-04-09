import { Router } from "express";
import {
  getAllConversations,
  getConversation,
  createConversation,
  deleteConversation,
  editConversation,
  getConversationDetails,
} from "../controllers/conversation";

const conversationRouter = Router();

conversationRouter
  .get("/", getAllConversations)
  .post("/", createConversation)
  .put("/", editConversation)
  .get("/conversation", getConversation)
  .get("/:conversationId/details", getConversationDetails)
  .delete("/:id", deleteConversation);

export default conversationRouter;
