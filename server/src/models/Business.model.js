import mongoose from "mongoose";

//business name
//registration date
///sector
//business address(line1 + line2)
//village
//tehsil
//post
//postal code
//state
//district
//bank name
//account holder name
//bank account number
//ifsc code
//objectives of business

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  }, 
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },     
  email: {
    type: String,
    trim: true
  },
  mobileNo: {
    type: String,
    trim: true
  },
  registrationDate: {
    type: Date,
    required: true
  },
  sectors: {
    type: [String],
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
  villageTown: {
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
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true
  },
  objectivesOfbusiness: {
    type: String,
    required: true,
    trim: true
  },


  // Documents Upload Fields 
  businessProof: {
    type: String, 
  },
  ownershipProof: {
    type: String,
  },
  moa: {
    type: String,
  },
  aoa: {
    type: String,
  },
  bankStatement: {
    type: String,
  },
  bankPassbook: {
    type: String,
  },
  partnershipDeed: {
    type: String 
  },
  businessContinuityProof: {
    type: String,
  },
  status :{
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  representative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Representative',
    required: true
  },
  statusDocs: {
    type: [Number],
    default: [2, 2, 2, 2, 2, 2, 2, 2],
    validate: {
        validator: function (v) {
            return Array.isArray(v) && v.length === 8;
        },
        message: props => `statusDocs must be an array of exactly 8 numbers.`
    }
},
query:[{
    type:String
}],
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
