//which property?
//which user
//price
//dates
//guests
//paid

import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    property:{
    type:mongoose.Schema.ObjectId,
    ref:"Property",
    required:[true,"Booking must belong to a property"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        rquired:[true,"Booking must belong to a User"]
    },
    price:{
        type:Number,
        required:[true,"Booking must have a price"]
    },
    paid:{
        type:Boolean,
        default:true
    },
    fromDate:{
        type:Date,
    },
    toDate:{
        type:Date
    },
    guests:{
        type:Number,
    },
    numberOfNights:{
        type:Number,
    }
},
    {timestamps:true}
);

bookingSchema.pre(/^find/,function(next){
    this.populate("user");
    this.populate({
        path:property,
        select:"maximumGuest images propertyName address"
    });
    next();
});

const Booking=mongoose.model("Booking",bookingSchema);
export {Booking};