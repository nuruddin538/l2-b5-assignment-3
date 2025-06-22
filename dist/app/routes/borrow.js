"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const borrow_1 = require("../controllers/borrow");
const router = (0, express_1.Router)();
router.post("/", borrow_1.borrowBook);
router.get("/", borrow_1.getBorrowedBooksSummary);
exports.default = router;
