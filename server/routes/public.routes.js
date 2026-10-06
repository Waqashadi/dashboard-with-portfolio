import express from "express";
import repositoryRoutes from "./repository.routes.js";
import {
  googleLoginUser,
  loginUser,
  registerUser,
} from "../controllers/user.auth.controller.js";
import { getPublicSkills } from "../controllers/skill.controller.js";
import { getPublicPortfolio } from "../controllers/public.controller.js";

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/google", googleLoginUser);

router.get("/portfolio", getPublicPortfolio);
router.get("/skills", getPublicSkills);
router.use("/repositories", repositoryRoutes);
router.use(repositoryRoutes);

export default router;