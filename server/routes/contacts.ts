import { Router } from "express";
import {
  getAllContacts,
  getContact,
  newContact,
  editContact,
  deleteContact,
} from "../controllers/contacts";

const contactRouter = Router();

contactRouter
  .get("/", getAllContacts)
  .post("/", newContact)
  .get("/:id", getContact)
  .put("/:id", editContact)
  .delete("/:id", deleteContact);

export default contactRouter;
