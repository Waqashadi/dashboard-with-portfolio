import dotenv from "dotenv";
import app from "./app.js";
import { dbConnection } from "./config/db.js";
import "./models/associations.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  const Connected = await dbConnection();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();