import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true,
        trim:true
    },
    adminPassword:{
        type:String,
        required:true,
    },
    pendingBusinesses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Business'
    }],
    verifiedBusiness:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Business'
    }],
    pendingFunds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Fund'
    }],
    verifiedFunds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Fund'
    }],
    grantedFunds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fund'
    }],
    adminType:{
        type:String,
        enum:['viewer','BusinessVerifier','FundVerifier','FundGranter'],
        required:true
    },
    refreshToken:{
        type:String
    }
    
},{timestamps: true});


adminSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.adminPassword);
};

adminSchema.methods.generateAccessTokenAdmin = function(){
    return jwt.sign(
        { _id: this._id, role: "admin" ,adminName:this.adminName},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

adminSchema.methods.generateRefreshTokenAdmin = function(){
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    
}


export default mongoose.model('Admin',adminSchema);