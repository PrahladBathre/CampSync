
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const connectDB = async () => {
  const database = process.env.DATABASE;
  const db_name = DB_NAME;
  const db_user = process.env.DB_ID;
  const db_pass = process.env.DB_PASSWORD;

  if (!database) {
    throw new Error("DATABASE environment variable is missing");
  }

  try {
    const conn = await mongoose.connect(database, {
      dbName: db_name || "Department",
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
