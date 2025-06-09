import Fund from "../models/Fund.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
//ApiError(statusCode, message,data, errors)
//ApiResponse(statusCode, data,message,stack)
import { ApiResponse } from "../utils/ApiResponse.js";
import Representative from "../models/Representative.model.js";
import Business from "../models/Business.model.js";
import { sendSubmissionNotifications } from "../utils/notifications.js";

function safeParseJSON(value) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

const step2DocFieldsConfig = [
    { name: "certificationOfBusinessPath", isArray: false },
    { name: "panCardPath", isArray: false },
    { name: "gstRegistrationPath", isArray: false },
    { name: "projectAyushPractitionCertificatePath", isArray: false },
    { name: "boardResolutionPath", isArray: false },
    { name: "generalLandLeaseDocumentsPaths", isArray: true },
    { name: "siteLayoutPlanPath", isArray: false },
    { name: "vendorQuotationPaths", isArray: true },
    { name: "bankStatementPath", isArray: false },
    { name: "auditedFinancialsPaths", isArray: true },
    { name: "stateShareCommitmentLetterPath", isArray: false },
    { name: "projectProposalPDFPath", isArray: false },
    { name: "additionalSupportingDocumentsPaths", isArray: true },
];

const getAllFund = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const representative = await Representative.findOne({ userId })
        console.log('representative data :>> ', representative);

        if (!representative) {
            return res.status(404).json(new ApiError(404, "Representative not found", null));
        }
        const business = await Business.findOne({ representative: representative._id });
        if (!business) {
            return res.status(404).json(new ApiError(404, "Business not found", null));
        }
        console.log('business data:>> ', business);
        const businessId = business._id;
        const allFunds = await Fund.find({ businessId }).sort({ createdAt: -1 })
        console.log('allFunds data :>>', allFunds);
        return res
            .status(200)
            .json(
                new ApiResponse(200, allFunds, 'All Funds fetched successfully')
            )

    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error fetching All funds for the particular business", error));
    }
})

const createFundDraft = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const representative = await Representative.findOne({ userId })
        console.log('representative data :>> ', representative);

        if (!representative) {
            return res.status(404).json(new ApiError(404, "Representative not found", null));
        }
        const business = await Business.findOne({ representative: representative._id });
        if (!business) {
            return res.status(404).json(new ApiError(404, "Business not found", null));
        }
        console.log('business data:>> ', business);
        const businessId = business._id;

        const fund = new Fund({
            businessId,
            scheme: "",
            subcomponent: "",
            status: "Draft",
            stepsCompleted: 0,
        })
        await fund.save();
        return res
            .status(201)
            .json(
                new ApiResponse(201, fund, "New Fund Draft Created Successfully")
            )
    } catch (error) {
        console.error("❌ New Fund Creation Error", error);
        console.error("❌ Mongoose Validation Errors (if any):", error.errors);
        return res
            .status(500)
            .json({ success: false, message: error.message, stack: error.stack });
    }
})

const getFundById = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const representative = await Representative.findOne({ userId })
        console.log('representative data :>> ', representative);

        if (!representative) {
            return res.status(404).json(new ApiError(404, "Representative not found", null));
        }
        const business = await Business.findOne({ representative: representative._id });
        if (!business) {
            return res.status(404).json(new ApiError(404, "Business not found", null));
        }
        console.log('business data:>> ', business);
        const businessId = business._id;
        const { fundId } = req.params;
        const fund = await Fund.findById(fundId);
        if (!fund) {
            return res
                .status(404)
                .json(
                    new ApiError(404, "Fund Not Found", null)
                )
        }
        if (String(businessId) !== String(fund.businessId)) {
            return res.status(403)
                .json(new ApiError(403, 'Forbidden ,not valid business'))
        }
        return res.status(200)
            .json(new ApiResponse(200, fund, "Current fund fetched Successfully"))
    } catch (error) {
        return res.status(500)
            .json(new ApiError(500, 'Error getting fund by Id', null))
    }
})

const updateFundStep = asyncHandler(async (req, res) => {
    console.log("Body", req.body);

    const fundData = req.body;
    const files = req.files;
    const { fundId, stepNumber } = req.params;
    const step = parseInt(stepNumber, 10);
    console.log("fundData: ", fundData);
    console.log('step:', step);
    console.log('files:', files);
    console.log('fundId :>> ', fundId);
    // Validate step
    const userId = req.user._id;
    const representative = await Representative.findOne({ userId })
    console.log('representative data :>> ', representative);

    if (!representative) {
        return res.status(404).json(new ApiError(404, "Representative not found", null));
    }
    const business = await Business.findOne({ representative: representative._id });
    if (!business) {
        return res.status(404).json(new ApiError(404, "Business not found", null));
    }
    console.log('business data:>> ', business);
    const businessId = business._id;

    const fund = await Fund.findById(fundId);
    if (!fund) {
        return res.status(404).json(new ApiError(404, "Fund not found for this Id", null));
    }
    if (String(businessId) !== String(fund.businessId)) {
        return res.status(403)
            .json(new ApiError(403, 'Forbidden ,not valid business'))
    }
    if (fund.status !== 'Draft') {
        return res.status(403)
            .json(new ApiError(403, 'Cannot modify an already Submitted form'))
    }

    if (step == 0) {
        try {
            const { scheme, subcomponent } = fundData;
            console.log('scheme:', scheme);
            console.log('subcomponent:', subcomponent);
            // Validate scheme and subcomponent
            if (!scheme || !subcomponent) {
                return res.status(400).json(new ApiError(400, "Scheme, subcomponent are required", null));
            }

            if (!scheme || !["NAM", "AEDS", "Others"].includes(scheme)) {
                return res.status(400).json(new ApiError(400, "Invalid scheme", null));
            }

            const validSubcomponents = [
                "Infrastructure",
                "Equipment",
                "QualityLabs",
                "MedicinalPlants",
                "CapacityBuilding",
                "SeedCapital",
                "InterestSubsidy"
            ]

            if (!subcomponent || !validSubcomponents.includes(subcomponent)) {
                return res.status(400).json(new ApiError(400, "Invalid subcomponent", null));
            }

            // Update fund
            fund.scheme = scheme
            fund.subcomponent = subcomponent
            fund.stepsCompleted = Math.max(fund.stepsCompleted || 0, 1);
            await fund.save();
            console.log('fund Data:>> ', fund);
            return res.status(201).json(new ApiResponse(201, fund, "Step 0 completed successfully"));
        } catch (error) {
            console.error("❌ STEP 0 ERROR:", error);
            console.error("❌ Mongoose Validation Errors (if any):", error.errors);
            return res
                .status(500)
                .json({ success: false, message: error.message, stack: error.stack });
        }
    }
    else if (step == 1) {
        try {
            const {
                projectTitle,
                projectDuration,
                totalProjectCost,
                grantAmountSought,
                objectivesHtml,
                outcomesHtml,
                infrastructureDetails: infraJson,
                equipmentAndMachinery: equipJson,
                staffingPlan: staffJson,
                timeLineAndMilestones: milestoneJson,
            } = fundData;

            //Basic validation
            if (
                !projectTitle ||
                !projectDuration ||
                !totalProjectCost ||
                !grantAmountSought ||
                !objectivesHtml ||
                !outcomesHtml
            ) {
                return res.status(400).json(new ApiError(400, "Missing required Proposal fields", null));
            }

            const parsedTotalCost = parseInt(totalProjectCost);
            const parsedGrant = parseInt(grantAmountSought);
            // console.log('infrastructurDetails :>> ', infrastructureDetails);
            const infraData = safeParseJSON(infraJson) || {}
            const equipmentArray = safeParseJSON(equipJson) || [];
            const staffingArray = safeParseJSON(staffJson) || [];
            const milestoneArray = safeParseJSON(milestoneJson) || [];


            const fileMap = {};
            for (const f of files) {
                if (!fileMap[f.fieldname]) fileMap[f.fieldname] = [];
                fileMap[f.fieldname].push(f);
            }

            // console.log('fileMap :>> ', fileMap);

            const updatedInfra = { locationType: infraData.locationType || null };

            if (fileMap['infrastructureDetails.ownershipProofFile']?.[0]) {
                updatedInfra.ownershipProofPath = fileMap['infrastructureDetails.ownershipProofFile'][0].path;
            }
            if (fileMap['infrastructureDetails.leaseDeedFile']?.[0]) {
                updatedInfra.leaseDeedPath = fileMap['infrastructureDetails.leaseDeedFile'][0].path;
            }
            if (fileMap['infrastructureDetails.leaseLicenseFile']?.[0]) {
                updatedInfra.leaseLicensePath = fileMap['infrastructureDetails.leaseLicenseFile'][0].path;
            }
            if (typeof infraData.builtUpArea === 'number' && infraData.builtUpArea >= 0) {
                updatedInfra.builtUpArea = infraData.builtUpArea;
            }
            // console.log('updatedInfra:>> ', updatedInfra);

            const updatedEquipment = equipmentArray.map((row, index) => {
                const eq = {
                    equipmentName: row.equipmentName || null,
                    quantity: row.quantity || 0,
                    unitCost: row.unitCost || 0,
                    totalCost: row.totalCost || 0,
                    vendorName: row.vendorName || null,
                };
                const eqFileList = fileMap['equipmentFiles'] || [];
                console.log('eqFileList:>> ', eqFileList);

                if (eqFileList[index]) {
                    eq.vendorQuotationPath = eqFileList[index].path;
                } else {
                    if (fund.equipmentAndMachinery[index]) {

                        eq.vendorQuotationPath = fund.equipmentAndMachinery[index].vendorQuotationPath;
                    }
                }
                return eq;
            });
            // console.log('updatedEquipment:>> ', updatedEquipment);

            const updatedStaffing = staffingArray.map((row, index) => {
                const st = {
                    role: row.role || null,
                    qualification: row.qualification || null,
                    monthlySalary: row.monthlySalary || 0,
                    duration: row.duration || null,
                    ayushRegistrationNumber: row.ayushRegistrationNumber || null,
                };

                const regFileList = fileMap['registrationFiles'] || [];

                if (regFileList[index]) {
                    st.registrationCertificatePath = regFileList[index].path;
                }
                else {
                    if (fund.staffingPlan[index]) {
                        st.registrationCertificatePath = fund.staffingPlan[index].registrationCertificatePath;
                    }
                }
                return st;
            });
            // console.log('updatedStaffing:>> ', updatedStaffing);

            const updatedMilestones = milestoneArray.map((ms) => ({
                milestone: ms.milestone || null,
                month: ms.month || null,
                deliverables: ms.deliverables || null,
                status: ms.status,
            }));
            // console.log('updatedMilestones:>> ', updatedMilestones);

            // Update the fund with the new proposal data
            fund.projectTitle = projectTitle;
            fund.projectDuration = projectDuration;
            fund.totalProjectCost = parsedTotalCost;
            fund.grantAmountSought = parsedGrant;
            fund.objectivesHtml = objectivesHtml;
            fund.outcomesHtml = outcomesHtml;
            fund.infrastructureDetails = updatedInfra;
            fund.equipmentAndMachinery = updatedEquipment;
            fund.staffingPlan = updatedStaffing;
            fund.timeLineAndMilestones = updatedMilestones;

            fund.stepsCompleted = Math.max(fund.stepsCompleted, 2); // Mark step 1 as completed

            await fund.save();
            console.log('Updated Fund Data:>> ', fund);

            return res.status(200).json(new ApiResponse(200, fund, " Step 2 Saved & Proposal data updated successfully"));

        } catch (error) {
            console.error("❌ Proposal Data Step ERROR:", error);
            console.error("❌ Mongoose Validation Errors (if any):", error.errors);
            return res
                .status(500)
                .json({ success: false, message: error.message, stack: error.stack });
        }
    }
    else if (step === 2) {
        try {
            if (!fund.uploads) {
                fund.uploads = {};
            }

            const newFilesMap = {};
            if (files && Array.isArray(files)) {
                files.forEach(file => {
                    if (!newFilesMap[file.fieldname]) {
                        newFilesMap[file.fieldname] = [];
                    }
                    newFilesMap[file.fieldname].push(file.path);
                });
            }

            console.log('newFilesMap for step 2:>> ', newFilesMap);

            for (const fieldConfig of step2DocFieldsConfig) {
                const fieldName = fieldConfig.name;
                const formInputForField = fundData[fieldName];
                const newUploadPathsForField = newFilesMap[fieldName] || [];

                let finalPathsForField = [];

                if (fieldConfig.isArray) {
                    const parsedInputFromClient = safeParseJSON(formInputForField) || [];
                    let newFileIdx = 0;

                    parsedInputFromClient.forEach(item => {
                        if (item && item.existingPath) {
                            finalPathsForField.push(item.existingPath);
                        }
                        else {
                            if (newUploadPathsForField[newFileIdx]) {
                                finalPathsForField.push(newUploadPathsForField[newFileIdx]);
                                newFileIdx++;
                            }
                        }
                    });

                    if (parsedInputFromClient.length === 0 && newUploadPathsForField.length > 0 && finalPathsForField.length === 0) {
                        finalPathsForField = [...newUploadPathsForField];
                    }
                    fund.uploads[fieldName] = finalPathsForField;
                }
                else {
                    if (typeof formInputForField === 'string' && formInputForField) {
                        finalPathsForField.push(formInputForField);
                    }
                    else if (newUploadPathsForField.length > 0) {
                        finalPathsForField.push(newUploadPathsForField[0]);
                    }

                    fund.uploads[fieldName] = finalPathsForField.length > 0 ? finalPathsForField[0] : undefined;
                }
                console.log(`Processing field: ${fieldName}, Final Path:`, fund.uploads[fieldName]);
            }

            fund.stepsCompleted = Math.max(fund.stepsCompleted || 0, 3); // Mark step 2 as completed

            await fund.save();
            console.log('Updated Fund Data after Step 2:>> ', fund);

            return res.status(200).json(new ApiResponse(200, fund, "Step 2 documents uploaded successfully"));

        } catch (error) {
            console.error("❌ Upload docs Step ERROR:", error);
            console.error("❌ Mongoose Validation Errors (if any):", error.errors);
            return res
                .status(500)
                .json({ success: false, message: error.message, stack: error.stack });
        }
    }
    else {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }
})

const submitFinalApplication = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { fundId } = req.params
    try {
        const representative = await Representative.findOne({ userId });
        if (!representative) {
            return res.status(404).json(new ApiError(404, "Representative not found", null));
        }
        const business = await Business.findOne({ representative: representative._id });
        if (!business) {
            return res.status(404).json(new ApiError(404, "Business not found", null));
        }
        const fund = await Fund.findById(fundId);
        if (!fund) {
            return res.status(404).json(new ApiError(404, "No fund submitted yet", null));
        }

        if (fund.status !== "Draft") {
            return res
                .status(400)
                .json({ message: "This application has already been submitted." });
        }
        fund.stepsCompleted = Math.max(fund.stepsCompleted || 0, 4);
        fund.status = "Submitted - PendingValidation";
        await fund.save();
        await sendSubmissionNotifications(fund);
        res.status(200).json(new ApiResponse(200, fund, "Final Data submitted Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in submitting Final Form", error));
    }
})

export {
    updateFundStep,
    submitFinalApplication,
    getFundById,
    createFundDraft,
    getAllFund,
};