import { Request, Response, NextFunction } from "express";
import { User } from "../../generated/prisma";
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from "../lib/prisma";
import { JWT_SECRET } from "../lib/config";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;

    if (!decoded) {
        return res.status(401).json({ error: "Invalid token" });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: decoded?.id as string
        }
    })
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
}

export default authenticate;