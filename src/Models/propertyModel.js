import slugify from "slugify";
import mongoose from "mongoose";
const propertySchema= new mongoose.Schema({
    propertyName:{
        type:String,
        required:[true,"Please enter your property name-"]
    },
    description:{
        type:String,
        required:[true,"please add information about ur property-"]
    },
    extraInfo:{
        type:String,
        default:"checkin on time, good services."
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },
    maximumGuest:{
        type:Number,
        required:[true,"please give the max no. of guests that can occupy"]
    },
    amenities: [
        {
            name: {
                type: String,
                required: true,
                enum:["Wifi", "Kitchen", "AC", "Washing machine", "Tv", "Pool", "Free Parking"]
            },
            icon: {
                type: String,
                required: true
            }
        }
    ],
    images:{
        type:[
            {
                public_id:{
                    type:String
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        validate:{
            validator:function(arr){
                return arr.length>=6;
            },
            message:"please upload atleast 6 images of your property"
        }
    },
    price:{
        type:Number,
        required:[true,"please enter the price per night value of your property"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number,
        country:String
    },
    //will add soon
    currentBookings:[

    ],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    slug:String,
    checkInTime:{type:String,default:"11:00"},
    checkOutTime:{type:String,default:"13:00"}
});

propertySchema.pre("save",function(next){
    this.slug=slugify(this.propertyName,{lower:true});
    next();
});
propertySchema.pre("save",function(next){
    this.address.area=this.address.area.toLowerCase().replaceAll(" ", "");
    next();
});
const Property=mongoose.model("Property",propertySchema);
export {Property};