import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    await mongoose.connect(process.env.dbURL as string);
    console.log("Successfully connected to database");
};