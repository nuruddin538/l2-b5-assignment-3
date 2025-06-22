"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const responseHandler_1 = require("../../utils/responseHandler");
const book_1 = __importDefault(require("../models/book"));
const createBook = async (req, res) => {
    try {
        const bookData = req.body;
        const book = await book_1.default.create(bookData);
        (0, responseHandler_1.successResponse)(res, "Book created successfully", book);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to create book", error);
    }
};
exports.createBook = createBook;
const getAllBooks = async (req, res) => {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = await book_1.default.find(query)
            .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
            .limit(parseInt(limit));
        (0, responseHandler_1.successResponse)(res, "Books retrieved successfully", books);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to retrieve books", error);
    }
};
exports.getAllBooks = getAllBooks;
const getBookById = async (req, res) => {
    try {
        const book = await book_1.default.findById(req.params.bookId);
        if (!book) {
            return (0, responseHandler_1.errorResponse)(res, "Book not found", null, 404);
        }
        (0, responseHandler_1.successResponse)(res, "Book retrieve successfully", book);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to retrieve book", error);
    }
};
exports.getBookById = getBookById;
const updateBook = async (req, res) => {
    try {
        const book = await book_1.default.findByIdAndUpdate(req.params.bookId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return (0, responseHandler_1.errorResponse)(res, "Book not found", null, 404);
        }
        // Update availability if copies were changed
        if (req.body.copies !== undefined) {
            await book_1.default.updateAvailability(book._id.toString());
        }
        (0, responseHandler_1.successResponse)(res, "Book updated successfully", book);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to update book", error);
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const book = await book_1.default.findByIdAndDelete(req.params.bookId);
        if (!book) {
            return (0, responseHandler_1.errorResponse)(res, "Book not found", null, 404);
        }
        (0, responseHandler_1.successResponse)(res, "Book deleted successfully");
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to delete book", error);
    }
};
exports.deleteBook = deleteBook;
