import { jwtVerify } from "jose";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return new TextEncoder().encode(secret);
};

export const authenticateToken = async (req, res, next) => {
  const authorization = req.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      issuer: "dashboard-api",
      audience: "dashboard-admin-api",
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.authenticatedUser = {
      id: payload.sub,
      email: payload.email,
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const email = req.authenticatedUser?.email?.toLowerCase();

  if (!email || !adminEmails.includes(email)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  return next();
};