import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();

const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  process.env.CLIENT_URL,
  process.env.NODE_ENV === "production" ? null : "http://localhost:3000",
]
  .filter(Boolean)
  .filter((origin, index, origins) => origins.indexOf(origin) === index);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});


app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  const status =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : error.message === "Origin is not allowed by CORS"
        ? 403
        : 500;
  console.error(
    "Request failed:",
    error instanceof Error ? error.message : error
  );
  res.status(status).json({
    success: false,
    message:
      status === 400
        ? "Invalid request"
        : status === 413
          ? "Request body is too large"
          : status === 403
            ? "Origin is not allowed"
            : "Internal server error",
  });
});

export default app;