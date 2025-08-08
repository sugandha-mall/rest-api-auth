import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import globalError from './middlewares/globalErrorHandler.js';

import type { HttpError } from 'http-errors';
import { config } from './config/config.js'
import userRouter from './user/router.js';
import bookRouter from './Book/BookRouter.js';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to API' });
});

// Global error handler
// app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
//   const statusCode = err.statusCode || 500;

//   return res.status(statusCode).json({
//     message: err.message,
//     errorStack: config.env === 'development' ? err.stack : '',
//   });
// });
app.use(globalError);
app.use('/api/users',userRouter)
app.use('/api/books',bookRouter)

export default app;
