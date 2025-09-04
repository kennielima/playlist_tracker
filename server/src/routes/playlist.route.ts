import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getFeaturedPlaylists, getPlaylist, getPlaylistSnapshot, trackPlaylist } from "../controllers/playlist.controller";

const router = express.Router();

router.get("/get-featured", ensureSpotifyToken, getFeaturedPlaylists);
router.get("/:id", ensureSpotifyToken, getPlaylist);
router.get("/:id/users/:userId/trackplaylist", ensureSpotifyToken, trackPlaylist);
router.get("/:id/getSnapshots", getPlaylistSnapshot);

export default router;