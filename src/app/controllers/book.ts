import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import Book, { Genre, IBook } from "../models/book";

export const createBook = async (req: Request, res: Response) => {
  try {
    const bookData: IBook = req.body;
    const book = await Book.create(bookData);
    successResponse(res, "Book created successfully", book);
  } catch (error) {
    errorResponse(res, "Failed to create book", error);
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .limit(parseInt(limit as string));

    successResponse(res, "Books retrieved successfully", books);
  } catch (error) {
    errorResponse(res, "Failed to retrieve books", error);
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return errorResponse(res, "Book not found", null, 404);
    }
    successResponse(res, "Book retrieve successfully", book);
  } catch (error) {
    errorResponse(res, "Failed to retrieve book", error);
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return errorResponse(res, "Book not found", null, 404);
    }

    // Update availability if copies were changed
    if (req.body.copies !== undefined) {
      await Book.updateAvailability(book._id.toString());
    }
    successResponse(res, "Book updated successfully", book);
  } catch (error) {
    errorResponse(res, "Failed to update book", error);
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return errorResponse(res, "Book not found", null, 404);
    }
    successResponse(res, "Book deleted successfully");
  } catch (error) {
    errorResponse(res, "Failed to delete book", error);
  }
};
