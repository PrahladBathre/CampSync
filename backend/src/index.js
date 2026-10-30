import connectDB from "./database/connect.database.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import { app } from "./app.js";

const PORT = process.env.PORT || 5000;

const connectWithRetry = async (attempt = 1) => {
  const maxAttempts = 4;
  try {
    await connectDB();
    console.log("Database connection is ready.");
  } catch (error) {
    if (attempt >= maxAttempts) {
      console.error(`Database connection failed after ${maxAttempts} attempts. Exiting so the hosting platform can restart the service.`, error.message);
      process.exit(1);
    }
    const delay = Math.min(2000 * (2 ** (attempt - 1)), 10000);
    console.error(`Database connection attempt ${attempt}/${maxAttempts} failed: ${error.message}. Retrying in ${delay / 1000}s.`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectWithRetry(attempt + 1);
  }
};

connectWithRetry()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CampSync API is listening on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("Unable to start CampSync API:", error);
    process.exit(1);
  });
