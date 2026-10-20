import {Property} from "../Models/propertyModel.js";
import {Booking} from "../Models/bookingModel.js";

//create order:booking any property
const createOrder=async(req,res)=>{
    const {amount,propertyId,fromDate,toDate,guests}=req.body;

    //orderID:order_1780533652671
    const orderId="order_"+Date.now();
    res.json({
        success:true,
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}
// verify payment
// 25,26
// 1. Save the booking
// 2. block the dates of the property

const verifyPayment=async(req,res)=>{
    const {orderId,bookingDetails,forceStatus}=req.body;

    if(forceStatus==="success"){
        const paymentId="pay_"+Date.now();

        const newBooking=await  Booking.create({
            user:req.user._id,
            property:bookingDetails.propertyId,
            price:bookingDetails.amount,
            fromDate:bookingDetails.fromDate,
            toDate:bookingDetails.toDate,
            guests:bookingDetails.guests,
            numberOfNights:bookingDetails.numberOfNights,
            paid:true
        });

        //tell property model that these dates are booked
        const updatedProperty=await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                        bookingId:newBooking._id,
                        fromDate:bookingDetails.fromDate,
                        toDate:bookingDetails.toDate,
                        userId:req.user._id
                    }
                }
            },
            {new:true}
        );

        res.json({
            success:true,
            message:"Payment successful, booking confirmed",
            paymentId,
            orderId,
            booking:newBooking
        })
    }else{
        res.status(400).json({
            success:false,
            message:"Payment failed, booking not confirmed",
            orderId
        })
    }
};

//get my bookings
const getUserBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({user:req.user._id});
        res.status(200).json({
            status:success,
            data:{
                bookings
            }
        })
    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
}

//get one booking details
// /:bookingid
const getBookingDetails=async(req,res)=>{
    try{
        const bookings=await Booking.findById(req.params.bookingId);

        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
}
export {getBookingDetails,getUserBookings,createOrder,verifyPayment}