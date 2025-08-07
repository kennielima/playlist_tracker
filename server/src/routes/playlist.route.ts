import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { fetchCurrentUserPlaylists, getTrackInfo } from "../controllers/playlist.controller";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/", ensureSpotifyToken, getTrackInfo)
router.get("/myplaylists", authenticate, ensureSpotifyToken, fetchCurrentUserPlaylists)

export default router;