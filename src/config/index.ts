import dotenv from "dotenv";
// find .env file in root and load the environment variables from it.
dotenv.config({ path: process.cwd() + "/.env" });

//  exports from "./config";
export const config = {
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
};
