import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getTrackInfo } from "../controllers/chart.controller";

const router = express.Router();

router.get("/", ensureSpotifyToken, getTrackInfo)

export default router;