import express, { Request, Response } from "express";
import { signup, login } from "../../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.post("/signup", async (req: Request, res: Response) => signup(req, res));
// router.post("/login", async (req: Request, res: Response) => login(req, res));

export default router;
