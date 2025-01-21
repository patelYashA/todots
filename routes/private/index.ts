import express, { Request, Response } from "express";
import todoRoutes from "./todo";
const router = express.Router();

router.use("/todo", todoRoutes)

export default router;
