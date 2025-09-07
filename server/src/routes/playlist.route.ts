import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { getFeaturedPlaylists, getPlaylist, getPlaylistSnapshots, getSnapshotById, stopTracker, startTracker } from "../controllers/playlist.controller";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.get("/get-featured", ensureSpotifyToken, getFeaturedPlaylists);
router.get("/:id", ensureSpotifyToken, getPlaylist);
router.get("/:id/startTracker", authenticate, ensureSpotifyToken, startTracker);
router.get("/:id/stopTracker", authenticate, stopTracker);
router.get("/:id/getSnapshots", getPlaylistSnapshots);
router.get("/:id/getSnapshots/:id", getSnapshotById);

export default router;