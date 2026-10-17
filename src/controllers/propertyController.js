//get all properties
//get property by id

import {Property} from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";

//get all properties
const getAllProperties=async(req,res)=>{
    try{
        const features=new APIFeatures(Property.find(),req.query).filter().search().paginate();
        const allProperties=await Property.find();
        const doc=await features.query;
        res.status(200).json({status:"success",no_of_responses:doc.length,data:doc});
    }catch(error){
        console.error("error searching properties",error);
        res.status(500).json({error:"internal server error"})
    }
}

//get property by id
//http://localhost:4000/api/v1/rent/listing/:id
//http://localhost:4000/api/v1/rent/listing/64e7f3c5d8f9b2a1c4e5d6f7
//req.params.id

const getProperty=async(req,res)=>{
    try{
        const property=await Property.findById(req.params.id);
        res.status(200).json({status:"success",data:property});
    }
    catch(error){
        res.status(404).json({status:"fail",message:error.message});
    }
}
export {getAllProperties,getProperty};