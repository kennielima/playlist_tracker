import { Request, Response } from "express"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";

async function getMe(req: Request, res: Response) {
    const user = req.user;
    // console.log("req.user", user)
    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { getMe }