import Representative from '../models/Representative.model.js';
import Business from '../models/Business.model.js';
import OTP from '../models/OTP.model.js';

export const stepRegistration = async (req, res) => {
  const step = parseInt(req.params.step);
  const formData = req.body;
  const files = req.files;

  console.log('Text fields:', formData);
  console.log('Files:', files);
  console.log('Current step:', step);

    if (step === 0) {
        try {
        const {
            firstName,
            lastName,
            dob,
            position,
            aadharNumber,
            panNumber,
            addressLine1,
            addressLine2,
            villageTown,
            tehsil,
            post,
            postalCode,
            state,
            district,
            addressProofName
        } = formData;


        // Format validation
        if (!/^\d{12}$/.test(aadharNumber)) {
            return res.status(400).json({ error: 'Aadhar must be 12 digits' });
        }

        if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(panNumber)) {
            return res.status(400).json({ error: 'Invalid PAN format' });
        }

        // Check for existing representative
        const existingRep = await Representative.findOne({
            $or: [
                { aadharNo: aadharNumber },
                { panNo: panNumber }
            ]
        });

        if (existingRep) {
            const conflicts = [];
            if (existingRep.aadharNo === aadharNumber) conflicts.push('Aadhar number');
            if (existingRep.panNo === panNumber) conflicts.push('PAN number');

            return res.status(409).json({
                success: false,
                message: `${conflicts.join(' and ')} already registered`,
                existingId: existingRep._id
            });
        }

        const representative = new Representative({
            name: `${firstName} ${lastName}`,
            dob,
            position,
            aadharNo: aadharNumber,
            panNo: panNumber,
            addressLine1,
            addressLine2,
            village: villageTown,
            tehsil,
            post,
            postalCode,
            state,
            district,
            addressProofName,
            userId: req.user._id, 
            stepsCompleted: 1
        });

        await representative.save();

        res.status(201).json({
            success: true,
            message: 'Step 0 completed and representative saved.',
            representative: representative
        });
        } catch (err) {
            console.error('Error saving representative at step 0:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    else if(step === 1){
        try {
            const userId = req.user._id;
            const representative = await Representative.findOne({ userId });

            console.log('User ID:', userId);
            console.log('Representative:', representative);

            if (!representative) {
                return res
                    .status(404)
                    .json({ success: false, 
                            message: 'Representative not found' 
                        });
            }

            // Process file uploads
            const fileFields = {
                addressProofFile: formData?.addressProofFile,
                aadharFile: formData?.aadharFile,
                panFile: formData?.panFile,
            };

            // Check if files are provided and assign them
            for(var i = 0; i < files.length; i++) {
                fileFields[files[i].fieldname] = files[i].filename;
            }

            console.log('File fields:', fileFields);

    
            representative.addressProofPic = fileFields.addressProofFile;
            representative.aadharPic = fileFields.aadharFile;
            representative.panPic = fileFields.panFile;

            representative.stepsCompleted = Math.max(representative.stepsCompleted, 2); // Update step count
            await representative.save();

            console.log('Business updated at step 3:', representative);

            return res
                    .status(200)
                    .json({ success: true, 
                            message: 'Step 3 handled',
                            representative: representative 
                        });

        } 
        catch (error) {
            console.log('Error in step 3:', error);
            return res
                    .status(500)
                    .json({ success: false, 
                            message: 'Server error in step 3', 
                            error: error.message 
                        });
        }
    }
    else if (step === 2) {
        // Handle step 2 logic here

        try {
            const currentStep = parseInt(req.params.step);
            const userId = req.user._id; 

            const {
                businessName,
                registrationNumber,
                registrationDate,
                sectors,
                addressLine1,
                addressLine2,
                villageTown,
                tehsil,
                post,
                postalCode,
                state,
                district,
                bankName,
                ifscCode,
                accountHolderName,
                bankAccountNumber,
                businessObjectives
            } = req.body;

            // Check if business already exists
            const existingbusiness = await Business.findOne({ 
                $or: [
                    { registrationNumber },
                    { bankAccountNumber }
                ]
            });

            if (existingbusiness) {
                return res.status(409).json({
                    success: false,
                    message: 'business with these details already exists'
                });
            }

            // Process file uploads
            const fileFields = {
                businessProof: "",
                ownershipProof: "",
                moa: "",
                aoa: "",
                bankStatement: "",
                bankPassbook: "",
                partnershipDeed: "",
                businessContinuityProof: ""
            };

            const representative = await Representative.findOne({ userId })
            if (!representative) {
                return res.status(404).json({
                    success: false,
                    message: 'Representative not found'
                });
            }

            // Create new business record
            const newbusiness = new Business({
                businessName: businessName,
                registrationNumber,
                registrationDate: new Date(registrationDate),
                sectors,
                addressLine1,
                addressLine2,
                villageTown,
                tehsil,
                post,
                postalCode,
                state,
                district,
                bankName,
                ifscCode,
                accountHolderName,
                bankAccountNumber,
                objectivesOfbusiness: businessObjectives,
                ...fileFields,
                representative: representative._id,
            });

            await newbusiness.save();

            representative.stepsCompleted = Math.max(representative.stepsCompleted, 3); // Update step count
            await representative.save();

            return res.status(201).json({
                success: true,
                message: 'business details submitted successfully',
                business: newbusiness,
                representative: representative
            });
        } 
        catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error during registration',
                error: error.message
            });
        }
    } 
    else if (step === 3) {

        try {
            const CRNNumber = formData.registrationNumber;
        
            const userId = req.user._id;
            const representative = await Representative.findOne({ userId });

            console.log('User ID:', userId);
            console.log('Representative:', representative);

            if (!representative) {
                return res
                    .status(404)
                    .json({ success: false, 
                            message: 'Representative not found' 
                        });
            }

            const business = await Business.findOne({ representative: representative._id , registrationNumber: CRNNumber });
            if (!business) {
                return res
                    .status(404)
                    .json({ success: false, 
                            message: 'business not found for this representative' 
                        });
            }

            // Process file uploads
            const fileFields = {
                businessProofFile: formData?.businessProofFile,
                ownershipProofFile: formData?.ownershipProofFile,
                moaFile: formData?.moaFile,
                aoaFile: formData?.aoaFile,
                bankStatementFile: formData?.bankStatementFile,
                bankPassbookFile: formData?.bankPassbookFile,
                partnershipDeedFile: formData?.partnershipDeedFile,
                businessContinuityProofFile: formData?.businessContinuityProofFile
            };

            // Check if files are provided and assign them
            for(var i = 0; i < files.length; i++) {
                fileFields[files[i].fieldname] = files[i].filename;
            }

            console.log('File fields:', fileFields);

            business.businessProof = fileFields.businessProofFile;
            business.ownershipProof = fileFields.ownershipProofFile;
            business.moa = fileFields.moaFile;
            business.aoa = fileFields.aoaFile;
            business.bankStatement = fileFields.bankStatementFile;
            business.bankPassbook = fileFields.bankPassbookFile;
            business.partnershipDeed = fileFields.partnershipDeedFile;
            business.businessContinuityProof = fileFields.businessContinuityProofFile;

            representative.stepsCompleted = Math.max(representative.stepsCompleted, 4); // Update step count
            await representative.save();
            await business.save();

            console.log('Business updated at step 3:', business);

            return res
                    .status(200)
                    .json({ success: true, 
                            message: 'Step 3 handled',
                            business: business,
                            representative: representative
                        });

        } 
        catch (error) {
            console.log('Error in step 3:', error);
            return res
                    .status(500)
                    .json({ success: false, 
                            message: 'Server error in step 3', 
                            error: error.message 
                        });
        }
    }
    else if (step === 4) {
        try {
            const userId = req.user._id;
            const CRNNumber = formData.registrationNumber;

            const representative = await Representative.findOne({ userId });

            if (!representative) {
                return res
                    .status(404)
                    .json({ success: false, 
                            message: 'Representative not found' 
                        });
            }

            representative.stepsCompleted = Math.max(representative.stepsCompleted, 5); // Update step count
            await representative.save();

            const business = await Business.findOne({ registrationNumber: CRNNumber });
            return res
                    .status(200)
                    .json({ success: true, 
                            message: 'Step 4 handled',
                            representative: representative,
                            business: business,
                            representative: representative 
                        });
        } 
        catch (error) {
            console.log('Error in step 4:', error);
            return res
                    .status(500)
                    .json({ success: false, 
                            message: 'Server error in step 4', 
                            error: error.message 
                        });
        }


    }
    else {
        return res
                .status(200)
                .json({ success: true, 
                        message: 'Step 4 handled' 
                    });
    }
};

export const getCurrentRepresentative = async(req, res) => {
    const userId = req.user._id;

    const representative = await Representative.findOne({ userId });
    if (!representative) {
        return res
            .status(201)
            .json({ success: true, message: 'Current User is not yet representer of any company.' });
    }

    const representativeId = representative._id;
    const business = await Business.findOne({ representative: representativeId });
    if (!business) {
        return res
            .status(202)
            .json({ success: true, message: 'Current Representative is not yet representer of any company.', representative });
    }

    return res.status(200).json({ success: true, representative, business });
}

export const getBusinessByRepresentative = async (req, res) => {
    const userId = req.user._id;

    try {
        const representative = await Representative.findOne({ userId });
        if (!representative) {
            return res
                .status(201)
                .json({ success: true, message: 'Current User is not yet representer of any company.' });
        }

        const representativeId = representative._id;
        const business = await Business.findOne({ representative: representativeId });
        console.log('Business found:', business);

        // in future agr ek representative ke pass multiple business ho to usko bhi handle karna padega
        // for now we are just getting one business of that representative
        // to jb more than one business rhenge to hme ....... dekhte hai ky krenge ... khuch idea ho to btao.


        if (!business) {
            return res
                .status(202)
                .json({ success: true, message: 'Current Representative is not yet representer of any company.', representative });
        }

        return res.status(200).json({ success: true, business });    
    } catch (error) {
        console.error('Error fetching business by representative:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });        
    }
}
export default {
    stepRegistration, 
    getCurrentRepresentative
};
