import type { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as MulterFiles;

    if (!files.coverImage || !files.file) {
      return res.status(400).json({
        error: "Cover image and book file are required",
      });
    }

    const coverImageFile = files.coverImage[0];
    const bookFile = files.file[0];

    const coverImagePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      coverImageFile.filename
    );
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFile.filename
    );

    // Upload cover image
    const coverImageUpload = await cloudinary.uploader.upload(coverImagePath, {
      folder: "book-covers",
      filename_override: coverImageFile.originalname,
      resource_type: "image",
    });

    // Upload book file (PDF, etc.)
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      folder: "book-pdfs",
      filename_override: bookFile.originalname,
      resource_type: "raw",
    });

    res.json({
      message: "Book uploaded successfully",
      coverImageUrl: coverImageUpload.secure_url,
      fileUrl: bookFileUpload.secure_url,
    });
  } catch (err) {
    next(err);
  }
};

export { createBook };
