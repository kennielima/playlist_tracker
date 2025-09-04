import express from "express";
import { callback, login, logout } from "../controllers/auth.controllers";

const router = express.Router();

router.get("/spotify/login", login)
router.get("/spotify/callback", callback)
router.get("/spotify/logout", logout)

export default router;