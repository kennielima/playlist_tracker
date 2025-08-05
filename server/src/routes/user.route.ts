import express from "express";
import authenticate from "../middlewares/authenticate";
import { fetchUserPlaylists, getMe } from "../controllers/user.controller";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";

const router = express.Router();

router.get("/me", authenticate, getMe)
router.get("/playlists", authenticate, ensureSpotifyToken, fetchUserPlaylists)

export default router;