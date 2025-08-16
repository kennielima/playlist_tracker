import express from "express";
import ensureSpotifyToken from "../middlewares/ensureSpotifyToken";
import { searchPlaylists } from "../controllers/search.controller";

const router = express.Router();

router.get("/", ensureSpotifyToken, searchPlaylists);

export default router;