import mongoose, { Document, Model, Schema } from "mongoose";

export enum Genre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the static methods interface
interface IBookModel extends Model<IBook> {
  updateAvailability(bookId: mongoose.Types.ObjectId | string): Promise<void>;
}

const bookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      required: true,
      enum: Object.values(Genre),
      uppercase: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Static method to update availability
bookSchema.statics.updateAvailability = async function (
  bookId: mongoose.Types.ObjectId | string
): Promise<void> {
  const book = await this.findById(bookId);
  if (book) {
    book.available = book.copies > 0;
    await book.save();
  }
};

// Middleware to validate copies
bookSchema.pre<IBook>("save", function (next) {
  if (this.copies < 0) {
    throw new Error("Copies must be a non-negative number");
  }
  next();
});

const Book: IBookModel = mongoose.model<IBook, IBookModel>("Book", bookSchema);
export default Book;
