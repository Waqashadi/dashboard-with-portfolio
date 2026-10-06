import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import User from "../models/user.model.js";
import {
  createAccessToken,
  sanitizeUser,
  verifyGoogleAssertion,
} from "../services/auth-service.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => email.trim().toLowerCase();

const getEmail = (value) => {
  if (typeof value !== "string" || !emailPattern.test(value.trim())) {
    return null;
  }
  const email = normalizeEmail(value);
  return email.length <= 100 ? email : null;
};

const invalidInput = (res, message) =>
  res.status(400).json({ success: false, message });

const isDuplicateEmail = (error) =>
  error instanceof UniqueConstraintError;

const reportFailure = (operation, error) => {
  console.error(
    `${operation} failed:`,
    error instanceof Error ? error.message : "Unknown error"
  );
};

export const registerUser = async (req, res) => {
  const name =
    typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = getEmail(req.body?.email);
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!name) return invalidInput(res, "Name is required");
  if (name.length > 100) {
    return invalidInput(res, "Name must be 100 characters or fewer");
  }
  if (typeof req.body?.email !== "string" || !req.body.email.trim()) {
    return invalidInput(res, "Email is required");
  }
  if (!email) return invalidInput(res, "A valid email is required");
  if (!password) return invalidInput(res, "Password is required");
  if (password.length < 6) {
    return invalidInput(res, "Password must be at least 6 characters");
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: null,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    reportFailure("Registration", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
};

export const loginUser = async (req, res) => {
  const email = getEmail(req.body?.email);
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!req.body?.email || !password) {
    return invalidInput(res, "Email and password are required");
  }
  if (!email) return invalidInput(res, "A valid email is required");

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = await createAccessToken(user);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    reportFailure("Login", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
};

export const googleLoginUser = async (req, res) => {
  if (!verifyGoogleAssertion(req)) {
    return res.status(401).json({
      success: false,
      message: "Google sign-in must be initiated through NextAuth",
    });
  }

  const name =
    typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = getEmail(req.body?.email);
  const image =
    typeof req.body?.image === "string" && req.body.image.trim()
      ? req.body.image.trim()
      : null;

  if (!name) return invalidInput(res, "Name is required");
  if (name.length > 100) {
    return invalidInput(res, "Name must be 100 characters or fewer");
  }
  if (!email) return invalidInput(res, "A valid email is required");
  if (image && image.length > 500) {
    return invalidInput(res, "Image URL must be 500 characters or fewer");
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      await user.update({ name, image });
    } else {
      user = await User.create({
        name,
        email,
        image,
        password: null,
      });
    }

    const token = await createAccessToken(user);
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    reportFailure("Google login", error);
    return res.status(500).json({
      success: false,
      message: "Unable to complete Google login",
    });
  }
};