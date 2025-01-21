import express, { Request, Response } from "express";
import publicRoutes from "./public/index";
import privateRoutes from "./private/index";
const router = express.Router();
import authMiddleware from "../middleware/authentication";

router.use(publicRoutes);

router.use(authMiddleware);

router.use(privateRoutes);

export default router;
