import mongoose, { Document, Model, Schema } from "mongoose";
import Book, { IBook } from "./book";

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId | IBook;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const borrowSchema: Schema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  { timestamps: true }
);

// Middleware to validate quantity against available copies
borrowSchema.pre<IBorrow>("save", async function (next) {
  const book = await Book.findById(this.book);
  if (!book) {
    throw new Error("Book not found");
  }
  if (book.copies < this.quantity) {
    throw new Error("Not enough copies available");
  }
  // Deduct copies
  book.copies -= this.quantity;
  await book.save();

  //   Update availability if needed
  if (book.copies === 0) {
    await Book.updateAvailability(book._id);
  }
  next();
});

const Borrow: Model<IBorrow> = mongoose.model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
