import dotenv from "dotenv";
import app from "./app.js";
import { dbConnection } from "./config/db.js";
import "./models/associations.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await dbConnection();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error(
    "Server startup failed:",
    error instanceof Error ? error.message : error
  );
  process.exitCode = 1;
});