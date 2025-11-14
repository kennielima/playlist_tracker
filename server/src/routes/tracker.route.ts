import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { stopTracker, startTracker } from "../controllers/tracker.controller";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/:id/startTracker", authenticate, ensureSpotifyToken, startTracker);
router.get("/:id/stopTracker", authenticate, ensureSpotifyToken, stopTracker);

export default router;
