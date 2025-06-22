import { Request, Response } from "express";
import Book from "../models/book";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import Borrow from "../models/borrow";

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;

    // Check if book exists
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return errorResponse(res, "Book not found", null, 404);
    }

    const borrow = await Borrow.create({ book, quantity, dueDate });
    successResponse(res, "Book borrowed successfully", borrow);
  } catch (error) {
    errorResponse(res, "Failed to borrow book", error);
  }
};

export const getBorrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
    successResponse(
      res,
      "Borrowed books summary retrieved successfully",
      summary
    );
  } catch (error) {
    errorResponse(res, "Failed to retrieve borrowed books summary", error);
  }
};
