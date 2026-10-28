import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import validator from "validator";
//schema means a schema is a structured framework, blueprint,
//  or mental outline used to organize information.
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:[true,"please enter your name-"],
            
            maxLength:[50,"your name cannot be longer than 50 characters-"],
        },
        email:{
            type:String,
            trim:true,
            required:[true,"Please enter email ID-"],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,"Please enter valid email address-"],
        },
        password:{
            type:String,
            required:[true,"please enter password"],
            minLength:[6,"please enter a passsword of minimum length 6"],
            select:false
        },
        passwordConfirm:{
            type:String,
            required:[true,"Please confirm your password"],
            validate:{
                validator:function(el){
                    return el===this.password;
                },
                message:"passwords are not the same"
            }

        },
        phoneNumber:{
            type:String,
            trim:true,
            required:true,
            unique:true
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        avatar:{
            url:{type:String},
            public_id:{type:String}
        },
        passwordChangedAt:{
            type:Date
        },
        passwordResetToken:{
            type:String,
            select:false,
            index:true
        },
        passwordResetExpires:{
            type:Date,
            select:false
        }
    },
    {timestamps:true}
)
//making settings so that secrets cannot pass in response server
userSchema.set("toJSON",{
    transform:function (doc,ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
});//in mongoDB collections are called documents

//password logic hashing
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return ;
    }
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    
});

//login check
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
return await bcrypt.compare(candidatePassword,userPassword);
}

//
userSchema.methods.changedPasswordAfter=function (JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimeStamp<changedTimeStamp;
    }
    return false;
}

//forgot password
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
}
const User=mongoose.model("User",userSchema);
//in mongoDB automatically makes User:Users
export {User};