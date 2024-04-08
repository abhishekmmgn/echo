import express, { type Express } from "express";
import { PrismaClient } from "@prisma/client";
import { PORT } from "./secrets";
import currentUserRouter from "./routes/current_user";
import bodyParser from "body-parser";
import cors from "cors";
import contactRouter from "./routes/contacts";
import conversationRouter from "./routes/conversations";

const app: Express = express();
export const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// npm i --save-dev @types/cors in bun way

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/current_user", currentUserRouter);
app.use("/contacts", contactRouter);
app.use("/conversations", conversationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
