import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getFeaturedPlaylists, getPlaylist, getPlaylistSnapshot, stopTracker, trackPlaylist } from "../controllers/playlist.controller";

const router = express.Router();

router.get("/get-featured", ensureSpotifyToken, getFeaturedPlaylists);
router.get("/:id", ensureSpotifyToken, getPlaylist);
router.get("/:id/users/:userId/trackplaylist", ensureSpotifyToken, trackPlaylist);
router.get("/:id/getSnapshots", getPlaylistSnapshot);
router.get("/:id/stopTracker", stopTracker);

export default router;