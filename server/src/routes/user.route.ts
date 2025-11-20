import express from "express";
import authenticate from "../middlewares/authenticate";
import { fetchCurrentUserPlaylists, fetchUserSnapshots, getMe } from "../controllers/user.controller";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";

const router = express.Router();

router.get("/me", authenticate, getMe)
router.get("/me/playlists", authenticate, ensureSpotifyToken, fetchCurrentUserPlaylists)
router.get("/me/snapshots", authenticate, ensureSpotifyToken, fetchUserSnapshots)

export default router;