import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on ${PORT}`);
});
