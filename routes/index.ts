import express, { Request, Response } from "express";
import publicRoutes from "./public/index"
const router = express.Router();

router.use(publicRoutes);

export default router;
