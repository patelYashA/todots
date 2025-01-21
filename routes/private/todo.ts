import express, { Request, Response } from "express";
import {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../../controllers/todo.controller";
const router = express.Router();

router.post("/createtodo", createTodo);
router.post("/getalltodos", getAllTodos);
router.get("/:todoId/gettodo", getTodo);
router.put("/:todoId/updatetodo", updateTodo);
router.delete("/:todoId/deletetodo", deleteTodo);

export default router;
