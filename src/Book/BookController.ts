import type { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import cloudinary from "../config/cloudinary.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import bookModel from "./bookModel.js";
import type { AuthRequest } from "../middlewares/authenticate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

const createBook = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const files = req.files as MulterFiles;
  const { title, genre } = req.body;

  if (!files?.coverImage?.[0] || !files?.file?.[0]) {
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

  try {
    // Upload cover image with original filename, overwrite if exists
    const coverImageUpload = await cloudinary.uploader.upload(coverImagePath, {
      folder: "book-covers",
      resource_type: "image",
      public_id: path.parse(coverImageFile.originalname).name, // original name without extension
      overwrite: true,
      unique_filename: false
    });

    // Upload book file (PDF) with original filename, overwrite if exists
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      folder: "book-pdfs",
      resource_type: "raw",
      public_id: path.parse(bookFile.originalname).name, // original name without extension
      overwrite: true,
      unique_filename: false
    });
    console.log("bookFileUpload",bookFileUpload);
    console.log("UploadResult",coverImageUpload);
    //console.log("user Id",req.userId);

    
    // Save to DB
    //const _req=req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: req.userId, // replace with req.user.id if using auth
      coverImage: coverImageUpload.secure_url,
      file: bookFileUpload.secure_url,
    });

    res.status(201).json({
      id: newBook._id,
      message: "Book uploaded successfully",
      coverImageUrl: coverImageUpload.secure_url,
      fileUrl: bookFileUpload.secure_url,
    });
  } catch (err) {
    next(err);
  } finally {
    // Cleanup temp files regardless of success/failure
    await Promise.allSettled([
      fs.promises.unlink(coverImagePath),
      fs.promises.unlink(bookFilePath),
    ]);
  }
};

export { createBook };
