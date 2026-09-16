import express from "express";

import {
  getProfile,
  syncRepositories,
  syncActivity,
  syncProfile,
  updateProfile,
  deleteProfile, // <-- Import delete controller
} from "../controllers/github.controller.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/profile", getProfile);

/**
 * Sync profile from GitHub
 */
router.post("/profile/sync", syncProfile);

/**
 * Update profile
 */
router.put("/profile/:id", updateProfile);

/**
 * Delete profile
 */
router.delete("/profile/:id", deleteProfile); // <-- Add DELETE route

router.post("/sync/repositories", syncRepositories);
router.post("/sync/activity", syncActivity);

export default router;