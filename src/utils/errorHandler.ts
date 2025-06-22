import { NextFunction, Request, Response } from "express";
import { errorResponse } from "./responseHandler";
import { Error } from "mongoose";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof Error.ValidationError) {
    return errorResponse(res, "Validation failed", err, 400);
  }

  if (err.name === "CastError") {
    return errorResponse(res, "Invalid ID format", null, 400);
  }

  if (err.message === "Book not found") {
    return errorResponse(res, err.message, null, 404);
  }

  if (err.message === "Not enough copies available") {
    return errorResponse(res, err.message, null, 400);
  }
  errorResponse(res, "Internal server error", null, 500);
};

export const notFoundHandler = (req: Request, res: Response) => {
  errorResponse(res, "Endpoint not found", null, 400);
};
