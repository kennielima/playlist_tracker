import express from "express";
import { getPlaylistSnapshots, getSnapshotById } from "../controllers/snapshot.controller";

const router = express.Router();

router.get("/:id/getSnapshots", getPlaylistSnapshots);
router.get("/:id/getSnapshots/:snapId", getSnapshotById);

export default router;
