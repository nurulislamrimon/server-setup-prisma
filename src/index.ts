import app from "./app/app";
import { IncomingMessage, Server, ServerResponse } from "http";
import { config } from "./config";
import prisma from "./orm";

// app
const port = config.port || 5000;

// server
let server: Server<typeof IncomingMessage, typeof ServerResponse>;

async function main() {
  try {
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown function
const gracefulShutdown = async (exitCode: number = 0) => {
  if (server) {
    console.log("Graceful shutdown initiated");
    server.close();
    console.log("HTTP server closed");
    await prisma.$disconnect();
    console.log("Database connections closed");
    process.exit(exitCode);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  gracefulShutdown(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown(1);
});

// Handle SIGINT and SIGTERM signals for graceful termination
process.on("SIGINT", async () => await gracefulShutdown());
process.on("SIGTERM", async () => await gracefulShutdown());
