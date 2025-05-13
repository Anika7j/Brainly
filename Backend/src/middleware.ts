import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./config";

export const userAuthorization = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token || typeof token !== "string") {
        console.log("one");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as unknown as { id: string };
        (req as any).userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
