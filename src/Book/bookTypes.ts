import type { User } from "../user/userTypes.js"; // adjust the path if needed

export interface Book {
    _id: string;
    title: string;
    author: User;
    genre: string;
    coverImage: string;
    file: string;
}

// ✅ Add missing MulterFiles type
export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}
