import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {router} from "./routes/userRoutes.js";
import connectDB from "./utils/db.js";
import {propertyRouter} from "./routes/propertyRouter.js";

const app=express();
dotenv.config();
const port=process.env.PORT;

//express.json//middleware
app.use(express.json({limit:"100mb"}));

//express.urlencoded//middleware
app.use(express.urlencoded({limit:"100mb",extended:true}))

//cookieParser//middleware
app.use(cookieParser());
//test route-
app.get("/",(req,res)=>{
    res.send("HomelyHub server is running.");
});
//app is exress application

app.use("/api/v1/rent/user",router);
app.use("/api/v1/rent/listing",propertyRouter);

connectDB();

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
}); 

