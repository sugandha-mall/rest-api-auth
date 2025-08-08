import path from 'node:path';
import express from 'express';
import Multer  from 'multer';
import {createBook} from "./BookController.js"
import multer from 'multer';
const bookRouter = express.Router();
//store local 
const upload=multer({
    dest:path.resolve(__dirname,'../../public/data/uploads'),//multer will create
    limits:{fileSize:3e7}//30 mb 
})
bookRouter.post('/',upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1},
]), createBook);
//userRouter.post('/login', loginUser);

export default bookRouter;
