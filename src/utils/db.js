//try to revise or go through the the below 
// text frequently or multiple times
import mongoose from "mongoose";

//memorise the below statement(in multiple lines)-
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
    //0-No error,success
    //1-Error,failure
  }
};

export default connectDB;