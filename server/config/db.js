import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",

    port:
      Number(process.env.DB_PORT) || 3307,

    dialect: "mysql",

    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export async function dbConnection() {
  try {
    await sequelize.authenticate();

    console.log(
      "Database connected successfully"
    );

    return true;
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );

    return false;
  }
}

export default sequelize;