import { Router } from "express";
import multer from "multer";
// ✅ Add `.js` to local imports
import { createBook, updateBook } from "./BookController.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

router.patch(
  "/:bookId",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

export default router;
