import { PrismaClient } from "@prisma/client";
import { config } from "../config";

// prisma client
const prisma = new PrismaClient({
  // log: config.env === "production" ? [] : ["query", "info", "warn", "error"],
  log: [],
});

export default prisma;
