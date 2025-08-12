import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import { createBook } from './BookController.js';
import authenticate from '../middlewares/authenticate.js';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookRouter = express.Router();

// Store locally
const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'), // multer will create folder if it exists in path
    limits: { fileSize: 3e7 } // 30 MB
});

bookRouter.post(
    '/',
    authenticate,
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]),
    createBook
);

export default bookRouter;
