"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowedBooksSummary = exports.borrowBook = void 0;
const book_1 = __importDefault(require("../models/book"));
const responseHandler_1 = require("../../utils/responseHandler");
const borrow_1 = __importDefault(require("../models/borrow"));
const borrowBook = async (req, res) => {
    try {
        const { book, quantity, dueDate } = req.body;
        // Check if book exists
        const bookExists = await book_1.default.findById(book);
        if (!bookExists) {
            return (0, responseHandler_1.errorResponse)(res, "Book not found", null, 404);
        }
        const borrow = await borrow_1.default.create({ book, quantity, dueDate });
        (0, responseHandler_1.successResponse)(res, "Book borrowed successfully", borrow);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to borrow book", error);
    }
};
exports.borrowBook = borrowBook;
const getBorrowedBooksSummary = async (req, res) => {
    try {
        const summary = await borrow_1.default.aggregate([
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
        (0, responseHandler_1.successResponse)(res, "Borrowed books summary retrieved successfully", summary);
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, "Failed to retrieve borrowed books summary", error);
    }
};
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
