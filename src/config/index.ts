import dotenv from "dotenv";
// find .env file in root and load the environment variables from it.
dotenv.config({ path: process.cwd() + "/.env" });

//  exports from "./config";
export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
};
