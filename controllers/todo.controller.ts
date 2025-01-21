import { Request, Response } from "express";
import TodoModel from "../models/todo.model";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response";

interface UserRequest extends Request {
  user?: any;
}

export const createTodo = async (
  req: UserRequest,
  res: Response
): Promise<any> => {
  try {
    const { title, description, dueDate } = req.body;
    const { _id: userId } = req.user;
    const newTodo = new TodoModel({
      title,
      description,
      userId,
      dueDate,
    });
    const todo = await newTodo.save();
    sendSuccessResponse(res, { data: todo });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};

export const getAllTodos = async (
  req: UserRequest,
  res: Response
): Promise<any> => {
  try {
    const { _id: userId } = req.user;
    const { startDate, endDate } = req.body;
    const todos = await TodoModel.find({ 
      userId,
      ...(startDate && endDate
        ? {
          $and: [
            { createdAt: { $gte: new Date(startDate) } },
            { createdAt: { $lte: new Date(endDate) } },
          ],
        }
        : {}),
     });
    sendSuccessResponse(res, { data: todos });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};

export const getTodo = async (
  req: UserRequest,
  res: Response
): Promise<any> => {
  try {
    const { todoId } = req.params;
    const todo = await TodoModel.findById(todoId);
    sendSuccessResponse(res, { data: todo });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};

export const updateTodo = async (
  req: UserRequest,
  res: Response
): Promise<any> => {
  try {
    const { todoId } = req.params;
    let columns = Object.keys(req.body);
    let columnNames = columns.map((val) => {
        return { [val]: req.body[val] };
    });
    const mergedObject = columnNames.reduce((result, currentObject) => {
        return { ...result, ...currentObject };
    }, {});
    const updatedTodo = await TodoModel.findByIdAndUpdate(todoId, mergedObject, {
      new: true,
    });
    sendSuccessResponse(res, { data: updatedTodo });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};

export const deleteTodo = async (
  req: UserRequest,
  res: Response
): Promise<any> => {
  try {
    const { todoId } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);
    sendSuccessResponse(res, { data: "Todo deleted" });
  } catch (error: any) {
    sendErrorResponse(res, error.message);
  }
};
