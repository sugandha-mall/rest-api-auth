import express from 'express';

import {createBook} from "./BookController.js"
const bookRouter = express.Router();

bookRouter.post('/', createBook);
//userRouter.post('/login', loginUser);

export default bookRouter;
