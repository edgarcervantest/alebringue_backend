import { Router, Request, Response } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, AuthRequest } from "../middleware/auth";

const authRouter = Router();

interface SignUpBody {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

authRouter.post(
  "/signup",
  async (req: Request<{}, {}, SignUpBody>, res: Response) => {
    try {
      //get req body
      const { name, email, password, password_confirmation } = req.body;

      if(!password_confirmation){
        res.status(400).json({ error: "Password confirmation is required" });
        return;
      }
      if(password !== password_confirmation){
        res.status(400).json({ error: "Password and password confirmation do not match" });
        return;
      }

      // check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser.length) {
        res.status(400).json({ error: "User with this email already exists" });
        return;
      }
      // hash password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // create new user
      const newUser: NewUser = {
        name,
        email,
        password: hashedPassword,
      };

      const [user] = await db.insert(users).values(newUser).returning();
      res.status(201).json(user);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  },
);

interface LoginBody {
  email: string;
  password: string;
}

authRouter.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
      //get req body
      const { email, password } = req.body;

      // check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!existingUser) {
        res.status(400).json({ error: "User with this email does not exist" });
        return;
      }
      // hash password compare
      const isMatch = await bcryptjs.compare(password, existingUser.password);
      if (!isMatch) {
        res.status(400).json({ error: "Incorretct password" });
        return;
      }

      const token = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_SECRET as string,
      );

      res.json({ token, ...existingUser });
    } catch (e: any) {
      res.status(500).json({ error: e.message || e });
    }
  },
);

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res.json(false);
      return;
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!verified) {
      res.json(false);
      return;
    }

    const verifiedToken = verified as { id: string };

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, verifiedToken.id));
    if (!user) {
      res.json(false);
      return;
    }

    res.json(true);
  } catch (e) {
    res.status(500).json(false);
  }
});

authRouter.get("/", auth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.user));

    res.json({ ...user, token: req.token });
  } catch (e) {
    res.status(500).json(false);
  }
});

export default authRouter;
