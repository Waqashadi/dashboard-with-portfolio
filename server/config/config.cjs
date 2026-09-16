require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3307,
    dialect: "mysql",
  },

  test: {
    username: process.env.TEST_DB_USER || process.env.DB_USER,
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME || "dashboard_test",
    host: process.env.TEST_DB_HOST || process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.TEST_DB_PORT) || Number(process.env.DB_PORT) || 3307,
    dialect: "mysql",
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3307,
    dialect: "mysql",
  },
};