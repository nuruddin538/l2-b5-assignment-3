"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, message, error = null, statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.errorResponse = errorResponse;
