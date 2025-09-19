import express from "express";
import {
  getStoryGame,
  processStoryChoice,
  getScenarioGame,
  submitScenarioResponse,
  getKitGame,
  evaluateKit,
  getGameStats
} from "../controllers/gameController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All game routes require authentication
router.use(protect);

// Story game routes
router.post("/story", getStoryGame);
router.post("/story/choice", processStoryChoice);

// Scenario game routes
router.post("/scenario", getScenarioGame);
router.post("/scenario/submit", submitScenarioResponse);

// Kit building game routes
router.post("/kit", getKitGame);
router.post("/kit/evaluate", evaluateKit);

// Game statistics
router.get("/stats", getGameStats);

export default router;