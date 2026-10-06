import express from "express";
import {
  getAllRepositories,
  getLanguages,
  getRepository,
  getRepositoryByRepoName,
} from "../controllers/repository.controller.js";

const router = express.Router();

router.get("/", getAllRepositories);
router.get("/name/:name", getRepositoryByRepoName);
router.get("/:id/languages", getLanguages);
router.get("/:id", getRepository);

export default router;
