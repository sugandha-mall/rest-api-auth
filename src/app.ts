import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ `.js` because after TypeScript compilation, this will be a .js file
import bookRouter from "./Book/BookRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/books", bookRouter);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5513, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5513}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
