import express from "express";
const bookingRouter=express.Router();

import { getBookingDetails,getUserBookings,createOrder,verifyPayment } 
from "../controllers/bookingController.js";

import {protect} from "../controllers/authController.js"

bookingRouter.get("/",protect,getBookingDetails);
bookingRouter.get("/:bookingId",protect,getUserBookings);
bookingRouter.post("/create-order",protect,createOrder);
bookingRouter.post("/verify-payment",protect,verifyPayment);

export {bookingRouter};