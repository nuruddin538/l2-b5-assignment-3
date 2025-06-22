"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const responseHandler_1 = require("./responseHandler");
const mongoose_1 = require("mongoose");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof mongoose_1.Error.ValidationError) {
        return (0, responseHandler_1.errorResponse)(res, "Validation failed", err, 400);
    }
    if (err.name === "CastError") {
        return (0, responseHandler_1.errorResponse)(res, "Invalid ID format", null, 400);
    }
    if (err.message === "Book not found") {
        return (0, responseHandler_1.errorResponse)(res, err.message, null, 404);
    }
    if (err.message === "Not enough copies available") {
        return (0, responseHandler_1.errorResponse)(res, err.message, null, 400);
    }
    (0, responseHandler_1.errorResponse)(res, "Internal server error", null, 500);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    (0, responseHandler_1.errorResponse)(res, "Endpoint not found", null, 400);
};
exports.notFoundHandler = notFoundHandler;
