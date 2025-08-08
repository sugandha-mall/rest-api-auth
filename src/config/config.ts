import dotenv from 'dotenv';
dotenv.config();

const _config = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.MONGO_CONNECTION_STRING,
  env:process.env.NODE_ENV,
  jwtSecret:process.env.JWT_SECRET
};

export const config = Object.freeze(_config);
