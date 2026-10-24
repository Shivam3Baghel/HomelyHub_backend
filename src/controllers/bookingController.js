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
    const {orderId,bookingDetails,forceStatus}=req.body ?? {};

    if(forceStatus!=="success"){
        return res.status(400).json({
            success:false,
            message:"Payment failed, booking not confirmed",
            orderId
        })
    }

    if(!bookingDetails || typeof bookingDetails!=="object"){
        return res.status(400).json({
            success:false,
            message:"bookingDetails is required"
        })
    }

    const {propertyId,amount,fromDate,toDate,guests,numberOfNights}=bookingDetails;
    if(!propertyId || amount===undefined || !fromDate || !toDate || guests===undefined){
        return res.status(400).json({
            success:false,
            message:"propertyId, amount, fromDate, toDate, and guests are required"
        })
    }

    try{
        const property=await Property.findById(propertyId);
        if(!property){
            return res.status(404).json({
                success:false,
                message:"Property not found"
            })
        }

        const paymentId="pay_"+Date.now();

        const newBooking=await  Booking.create({
            user:req.user._id,
            property:propertyId,
            price:amount,
            fromDate,
            toDate,
            guests,
            numberOfNights,
            paid:true
        });

        //tell property model that these dates are booked
        await Property.findByIdAndUpdate(
            propertyId,{
                $push:{
                    currentBookings:{
                        bookingId:newBooking._id,
                        fromDate,
                        toDate,
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
    }catch(error){
        console.error("Payment verification failed:",error);
        res.status(500).json({
            success:false,
            message:error.message
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
export {getBookingDetails,getUserBookings,createOrder,verifyPayment};