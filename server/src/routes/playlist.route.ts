import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getFeaturedPlaylists, getPlaylist } from "../controllers/playlist.controller";

const router = express.Router();

router.get("/get-featured", ensureSpotifyToken, getFeaturedPlaylists);
router.get("/:id", ensureSpotifyToken, getPlaylist);

export default router;