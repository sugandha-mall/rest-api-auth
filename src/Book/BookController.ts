import type { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary.js";
import bookModel from "./bookModel.js";
import type { MulterFiles } from "./bookTypes.js";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as MulterFiles;
    const { title, genre } = req.body;

    if (!files?.coverImage?.[0] || !files?.file?.[0]) {
      throw createHttpError(400, "Cover image and book file are required");
    }

    const coverImageFile = files.coverImage[0];
    const bookFile = files.file[0];

    const coverUpload = await cloudinary.uploader.upload(coverImageFile.path, {
      folder: "book-covers",
      resource_type: "image",
    });

    const fileUpload = await cloudinary.uploader.upload(bookFile.path, {
      folder: "book-pdfs",
      resource_type: "raw",
    });

    await fs.promises.unlink(coverImageFile.path);
    await fs.promises.unlink(bookFile.path);

    const newBook = await bookModel.create({
      title,
      genre,
      coverImage: coverUpload.secure_url,
      file: fileUpload.secure_url,
    });

    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const { title, genre } = req.body;
    const files = req.files as MulterFiles;

    const book = await bookModel.findById(bookId);
    if (!book) throw createHttpError(404, "Book not found");

    let coverUrl = book.coverImage;
    let fileUrl = book.file;

    if (files?.coverImage?.[0]) {
      const upload = await cloudinary.uploader.upload(files.coverImage[0].path, {
        folder: "book-covers",
        resource_type: "image",
      });
      coverUrl = upload.secure_url;
      await fs.promises.unlink(files.coverImage[0].path);
    }

    if (files?.file?.[0]) {
      const upload = await cloudinary.uploader.upload(files.file[0].path, {
        folder: "book-pdfs",
        resource_type: "raw",
      });
      fileUrl = upload.secure_url;
      await fs.promises.unlink(files.file[0].path);
    }

    const updated = await bookModel.findByIdAndUpdate(
      bookId,
      { title, genre, coverImage: coverUrl, file: fileUrl },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
