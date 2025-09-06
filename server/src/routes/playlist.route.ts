import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getFeaturedPlaylists, getPlaylist, getPlaylistSnapshots, getSnapshotById, stopTracker, trackPlaylist } from "../controllers/playlist.controller";

const router = express.Router();

router.get("/get-featured", ensureSpotifyToken, getFeaturedPlaylists);
router.get("/:id", ensureSpotifyToken, getPlaylist);
router.get("/:id/users/:userId/trackplaylist", ensureSpotifyToken, trackPlaylist);
router.get("/:id/users/:userId/stopTracker", stopTracker);
router.get("/:id/getSnapshots", getPlaylistSnapshots);
router.get("/:id/getSnapshotbyid", getSnapshotById);

export default router;