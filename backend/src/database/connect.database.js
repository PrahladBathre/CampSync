import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const database = process.env.DATABASE;
  if (!database) throw new Error("DATABASE environment variable is missing");

  try {
    const conn = await mongoose.connect(database, {
      dbName: DB_NAME || "Department",
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 30,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 2,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
