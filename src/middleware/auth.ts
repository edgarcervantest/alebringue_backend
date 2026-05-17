import { UUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { NewUser, users } from "../db/schema";

export interface AuthRequest extends Request {
  user?: UUID;
  token?: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      res.status(401).json({msg: "No auth token, authorization denied"});
      return;
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!verified) {
      res.status(401).json({msg: "Token verification failed"});
      return;
    }

    const verifiedToken = verified as { id: UUID };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verifiedToken.id));
      
    if (!user) {
      res.status(401).json({msg: "User not found"});
      return;
    }

    req.user = verifiedToken.id;
    req.token = token;

    next();
  } catch (e) {
    res.status(500).json(false);
  }
};
