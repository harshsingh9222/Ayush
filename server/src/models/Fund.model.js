import mongoose from "mongoose";
import { Schema } from "mongoose";
import Business from "./Business.model.js";
import User from "./user.models.js";

const EquipmentSchema = new mongoose.Schema({
    equipmentName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    unitCost: {
        type: Number,
        min: 0,
        required: true
    },
    vendorName: {
        type: String,
        required: true,
        trim: true
    },
    vendorQuotationPath: {
        type: String,
        required: true,
        trim: true
    },
    totalCost: {
        type: Number,
        min: 0,
        required: true
    }
})

const StaffingSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        trim: true
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    monthlySalary: {
        type: Number,
        min: 0,
        required: true
    },
    duration: {
        type: String,
        min: 1,
        required: true
    },
    ayushRegistrationNumber: {
        type: String,
        trim: true
    },
    registrationCertificatePath: {
        type: String,
        trim: true
    }
})

const SinglePaymentStageSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            required: true,
        },
        UC_received: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const QuerySchema = new Schema({
    raisedBy: {
        type: String,
        required: true,
    },
    queryText: {
        type: String,
        required: true,
    },
    raisedOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    responseText: {
        type: String,
        default: '',
    },
    respondOn: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    respondedBy: {
        type: String,
        default: '',
    },
}, {
    _id: false,
})

const MilestoneSchema = new mongoose.Schema({
    milestone: {
        type: String,
        required: true,
        trim: true
    },
    month: {
        type: Number,
        min: 1,
        max: 24,
        required: true
    },
    deliverables: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "In Progress"],
        default: "Pending"
    }
})


const fundSchema = new mongoose.Schema({
    //step1
    applicationReferenceNumber: {
        type: String,
        // required: true,
        unique: true,
        trim: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    scheme: {
        type: String,
        enum: ["NAM", "AEDS", "Others",""],
        // required: true,
        trim: true
    },
    subcomponent: {
        type: String,
        enum: ["","Infrastructure", "Equipment", "QualityLabs", "MedicinalPlants", "CapacityBuilding", "SeedCapital", "InterestSubsidy"],
        // required: true,
        trim: true
    },
    stepsCompleted: {
        type: Number,
        default: 0
    },

    //step2 Proposal Data
    projectTitle: {
        type: String,
        maxlength: 100,
    },
    projectDuration: {
        type: String,
        enum: ["6 months", "12 months", "18 months", "24 months"],
    },
    totalProjectCost: {
        type: Number,
        min: 0
    },
    grantAmountSought: {
        type: Number,
        min: 0
    },
    objectivesHtml: {
        type: String,
    },
    outcomesHtml: {
        type: String,
    },
    infrastructureDetails: {
        locationType: {
            type: String,
            enum: ["Owned", "Rented", "Leased"],
        },
        ownershipProofPath: {
            type: String,
        },
        leaseDeedPath: {
            type: String,
        },
        builtUpArea: {
            type: Number,
            min: 0
        },
        leaseLicensePath: {
            type: String,
        },
    },

    equipmentAndMachinery: [EquipmentSchema],
    staffingPlan: [StaffingSchema],
    timeLineAndMilestones: [MilestoneSchema],

    //step3 Document Uploads
    uploads: {
        certificationOfBusinessPath: {
            type: String
        },
        panCardPath: {
            type: String
        },
        gstRegistrationPath: {
            type: String
        },
        projectAyushPractitionCertificatePath: {
            type: String
        },
        boardResolutionPath: {
            type: String
        },

        generalLandLeaseDocumentsPaths: [
            {
                type: String
            }
        ],
        vendorQuotationPaths: [{
            type: String,
        }],
        siteLayoutPlanPath: {
            type: String
        },
        bankStatementPath: {
            type: String
        },
        auditedFinancialsPaths: [{
            type: String
        }],

        stateShareCommitmentLetterPath: {
            type: String
        },
        projectProposalPDFPath: {
            type: String
        },
        additionalSupportingDocumentsPaths: [{
            type: String
        }],
    },

    status: {
        type: String,
        enum: [

            // Drafting & Submission
            'Draft',
            'Submitted - PendingValidation', // basic server‐side checks (file size/type, budget sums)

            // State Share
            'PendingStateShare',           // waiting for State‐share commitment letter
            'StateShareApproved',          // State‐share is signed off

            // Technical & Financial Review
            'UnderTechnicalReview',        // AYUSH Tech Committee
            'TechnicalQueryRaised',        // they asked for more info
            'UnderFinancialReview',        // finance panel
            'FinancialQueryRaised',        // budget questions

            // Inspection
            'PendingSiteInspection',       // scheduled
            'InspectionCompleted',         // inspector uploaded report

            // Approval & Sanction
            'Approved',                    // sanction order generated
            'Rejected',                    // final rejection

            // Disbursement & UCs
            'FirstInstallmentDisbursed',   // 1st tranche out
            'UC1Submitted',                // user uploaded UC1
            'UC1Approved',                 // UC1 accepted
            'SecondInstallmentDisbursed',  // 2nd tranche
            'UC2Submitted',                // user uploaded UC2 / final UC
            'UC2Approved',                 // final UC accepted

            // Closure
            'Closed'                       // everything done—project closed & audited
        ],
        default: 'Draft',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date
    },
    queries: {
        type: [QuerySchema],
        default: []
    },
    inspectorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paymentReleaseStage: {
        stage1: {
            type: SinglePaymentStageSchema,
            default: undefined
        },
        stage2: {
            type: SinglePaymentStageSchema,
            default: undefined
        },
    },
    stepsCompleted: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//This virtual field calculates the state share amount accessed by the business based on the total project cost and the grant amount sought.
fundSchema.virtual('stateShare').get(function () {
    if (this.totalProjectCost != null && this.grantAmountSought != null) {
        return this.totalProjectCost - this.grantAmountSought;
    }
    return null;
});

fundSchema.pre('save', async function (next) {
    if (this.isNew && !this.applicationReferenceNumber && this.status === 'Draft') {
        try {
            const year = new Date().getFullYear();
            const countThisYear = await this.constructor.countDocuments({
                createdAt: {
                    $gte: new Date(year, 0, 1),
                    $lt: new Date(year + 1, 0, 1)
                }
            });

            const seqNum = String(countThisYear + 1).padStart(6, '0');

            const BusinessModel = this.constructor.model('Business');
            const biz = await BusinessModel.findById(this.businessId).select('state');
            if (!biz || !biz.state) {
                var stateCode = 'STATE'
            }
            else {
                let raw = biz.state.trim().replace(/[^A-Za-z]/g, '').toUpperCase();
                stateCode = raw.substring(0, 3) || 'STATE';
            }
            this.applicationReferenceNumber = `APP-${year}-${stateCode}-${seqNum}`;

        } catch (error) {
            return next(error)
        }
    }
    if (this.status !== 'Draft' && !this.submittedAt && this.isModified('status')) {
        this.submittedAt = new Date();
    }
    this.updatedAt = Date.now();
    next();
})

const Fund = mongoose.model("Fund", fundSchema);

export default Fund;