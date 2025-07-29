import express from "express";
import { callback, login } from "../controllers/auth.controllers";

const router = express.Router();

router.get("/spotify/login", login)
router.get("/spotify/callback", callback)

export default router;