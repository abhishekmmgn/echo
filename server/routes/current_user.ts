import { Router } from "express";
import {
  createNewUser,
  getBasicDetails,
  updateProfile,
  deleteUser,
} from "../controllers/current_user";

const currentUserRouter = Router();

currentUserRouter
  .get("/", getBasicDetails)
  .post("/", createNewUser)
  .put("/", updateProfile)
  .delete("/", deleteUser);

export default currentUserRouter;
