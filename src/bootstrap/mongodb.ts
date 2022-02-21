import config from "@common/config/config";
import mongoose from "mongoose";
import { DBConnectionError } from "@common/errors/db.errors";

export async function bootstrapMongo() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Successfully conected to MongoDB");
  } catch (err) {
    throw new DBConnectionError(err);
  }
}
