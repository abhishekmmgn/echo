import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;
export const CORS_PORT = process.env.CORS_PORT;
export const CORS_SERVER = process.env.CORS_SERVER;
