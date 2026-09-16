import express from "express";

import {
  getAllRepositories,
  getRepository,
  getRepositoryByRepoName,
  getLanguages,
  syncRepositoryData,
} from "../controllers/repository.controller.js";

const router = express.Router();

// Get all repositories
router.get("/", getAllRepositories);

// Get repository by name
router.get("/name/:name", getRepositoryByRepoName);

// Get repository languages
router.get("/:id/languages", getLanguages);

// Get repository by ID
router.get("/:id", getRepository);

// Sync repositories from GitHub
router.post("/sync", syncRepositoryData);

export default router;