import mongoose, { Mongoose } from 'mongoose';

//first name, last name
//dob
//position
//aadhar no and pic
//pan no and pic
//address line1 + lin2
//village
//tehsil
//post
//postal code
//state
//district
//Address proof name and pic

const representativeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },     
    email: {
        type: String,
        trim: true
    },
    mobileNo: {
        type: String,
        trim: true
    },   
    position: {
        type: String,
        required: true,
        trim: true
    },
    aadharNo: {
        type: String,
        required: true,
        trim: true
    },
    panNo: {
        type: String,
        required: true,
        trim: true
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true
    },
    addressLine2: {
        type: String,
        required: true,
        trim: true
    },
    village: {
        type: String,
        required: true,
        trim: true
    },
    tehsil: {
        type: String,
        required: true,
        trim: true
    },
    post: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    addressProofName: {
        type: String,
        required: true,
        trim: true
    },
    addressProofPic: {
        type: String,
        trim: true
    },
    aadharPic: {
        type: String,
        trim: true
    },
    panPic: {
        type: String,
        trim: true
    },
    profilePic: {
        type: String,
        trim: true
    },
    signaturePic: {
        type: String,
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    stepsCompleted: {
        type: Number,
        default: 0
    },

    // may be i have to reove this in future

    statusDocs: {
        type: [Number],
        default: [2, 2, 2],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length === 3;
            },
            message: props => `statusDocs must be an array of exactly 3 numbers.`
        }
    },
    query:[{
        type:String
    }],
    timeline: {
        type: Date,
        default: null 
      },
      countRejection:{
        type: Number,
        default: 0
      },
    
}, { timestamps: true });

const Representative = mongoose.model('Representative', representativeSchema);

export default Representative; 

// const ADDRESS_PROOF_INDEX = 0;
// const AADHAR_PIC_INDEX = 1;
// const PAN_PIC_INDEX = 2;