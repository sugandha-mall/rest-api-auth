import mongoose from "mongoose";
import type { Book } from "./bookTypes";


const bookSchema = new mongoose.Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // optional: only if referencing a User collection
  },
  coverImage: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<Book>("Book", bookSchema);
