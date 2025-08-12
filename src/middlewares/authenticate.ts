import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config.js";

export interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const parsedToken = token.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(parsedToken, config.jwtSecret as string) as JwtPayload;

    if (!decoded || typeof decoded.sub !== "string") {
      return next(createHttpError(401, "Invalid token payload"));
    }

    (req as AuthRequest).userId = decoded.sub;

    next();
  } catch (err) {
    return next(createHttpError(401, "Token expired or invalid"));
  }
};

export default authenticate;
