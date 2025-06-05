// src/components/Fund/Steps/ProposalData.jsx

import React, {
    useImperativeHandle,
    forwardRef,
    useEffect,
    useState, // Keep for error message and potentially existing file names
    useMemo,
} from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useSelector } from "react-redux"; // Assuming you'll set this up
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ProposalData = forwardRef(({ onSubmit }, ref) => { // Renamed prop for clarity
    // Assuming existingData comes from Redux or a similar prop structure.
    // For simplicity, I'll use existingDataFromProp. Replace with useSelector if needed.
    const existingData = useSelector((state) => state.fund.fundData || {});
    //   const existingData = existingDataFromProp; // Using prop directly for this example

    const [error, setError] = useState(""); // For general form errors not caught by RHF field errors

    // Store existing file names/URLs to display them if no new file is selected
    const [existingFileNames, setExistingFileNames] = useState({
        ownershipProofFile: null,
        leaseDeedFile: null, // Assuming leaseDeedFile was for "Owned" type in original logic
        leaseLicenseFile: null,
        equipmentFiles: [],
        registrationFiles: [],
    });


    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        setError: setFieldError,
        clearErrors: clearFieldError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            projectTitle: "",
            projectDuration: "",
            totalProjectCost: "",
            grantAmountSought: "",
            stateShare: 0,
            objectivesHtml: "",
            outcomesHtml: "",
            infrastructureDetails: {
                locationType: "",
                builtUpArea: "",
                // File fields will be handled separately for default values
            },
            equipmentRows: [
                {
                    equipmentName: "",
                    quantity: "",
                    unitCost: "",
                    vendorName: "",
                    vendorQuotationFile: null,
                    totalCost: 0,
                },
            ],
            staffRows: [
                {
                    role: "",
                    qualification: "",
                    monthlySalary: "",
                    duration: "",
                    ayushRegistrationNumber: "",
                    registrationFile: null,
                },
            ],
            milestoneRows: [ // Renamed for consistency
                {
                    milestone: "",
                    month: "",
                    deliverables: "",
                    status: "Pending",
                },
            ],
        },
    });

    const {
        fields: equipmentFields,
        append: appendEquipment,
        remove: removeEquipment,
    } = useFieldArray({ control, name: "equipmentRows" });
    const {
        fields: staffFields,
        append: appendStaff,
        remove: removeStaff,
    } = useFieldArray({ control, name: "staffRows" });
    const {
        fields: milestoneFields,
        append: appendMilestone,
        remove: removeMilestone,
    } = useFieldArray({ control, name: "milestoneRows" });

    // QuillJS hooks
    const { quill: quillObj, quillRef: objectivesRef } = useQuill({
        modules: { toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']] },
        formats: ['bold', 'italic', 'underline', 'strike', 'list', 'link'], // 'bullet' removed
        placeholder: "Describe the project objectives..."
    });
    const { quill: quillOut, quillRef: outcomesRef } = useQuill({
        modules: { toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link']] },
        formats: ['bold', 'italic', 'underline', 'strike', 'list', 'link'], // 'bullet' removed
        placeholder: "Describe the expected outcomes..."
    });


    // Initialize form with existingData
    useEffect(() => {
        if (existingData && Object.keys(existingData).length > 0) {
            const formValues = {
                projectTitle: existingData.projectTitle || "",
                projectDuration: existingData.projectDuration || "",
                totalProjectCost: existingData.totalProjectCost || "",
                grantAmountSought: existingData.grantAmountSought || "",
                stateShare: existingData.stateShare || 0, // Will be recalculated
                objectivesHtml: existingData.objectivesHtml || "",
                outcomesHtml: existingData.outcomesHtml || "",
                infrastructureDetails: {
                    locationType: existingData.infrastructureDetails?.locationType || "",
                    builtUpArea: existingData.infrastructureDetails?.builtUpArea || "",
                },
                equipmentRows: existingData.equipmentAndMachinery || [
                    { equipmentName: "", quantity: "", unitCost: "", vendorName: "", totalCost: 0 },
                ],
                staffRows: existingData.staffingPlan || [
                    { role: "", qualification: "", monthlySalary: "", duration: "", ayushRegistrationNumber: "" },
                ],
                milestoneRows: existingData.timeLineAndMilestones || [
                    { milestone: "", month: "", deliverables: "", status: "Pending" },
                ],
            };
            reset(formValues);

            // Set Quill content after reset
            if (quillObj && existingData.objectivesHtml) {
                quillObj.clipboard.dangerouslyPasteHTML(existingData.objectivesHtml);
            }
            if (quillOut && existingData.outcomesHtml) {
                quillOut.clipboard.dangerouslyPasteHTML(existingData.outcomesHtml);
            }

            // Populate existing file names for display
            setExistingFileNames({
                ownershipProofFile: existingData.infrastructureDetails?.ownershipProofFileName || null, // Assuming you store filename
                leaseDeedFile: existingData.infrastructureDetails?.leaseDeedFileName || null,
                leaseLicenseFile: existingData.infrastructureDetails?.leaseLicenseFileName || null,
                equipmentFiles: (existingData.equipmentAndMachinery || []).map(e => e.vendorQuotationFileName || null),
                registrationFiles: (existingData.staffingPlan || []).map(s => s.registrationFileName || null),
            });

        }
    }, [existingData, reset, quillObj, quillOut]);


    // Sync Quill with react-hook-form
    useEffect(() => {
        if (quillObj) {
            quillObj.on("text-change", (delta, oldDelta, source) => {
                if (source === 'user') {
                    const html = quillObj.root.innerHTML;
                    const text = quillObj.getText();
                    setValue("objectivesHtml", html, { shouldValidate: true, shouldDirty: true });
                    if (text.trim().length < 500) {
                        setFieldError("objectivesHtml", { type: "manual", message: "Objectives must be at least 500 characters." });
                    } else {
                        clearFieldError("objectivesHtml");
                    }
                }
            });
        }
    }, [quillObj, setValue, setFieldError, clearFieldError]);

    useEffect(() => {
        if (quillOut) {
            quillOut.on("text-change", (delta, oldDelta, source) => {
                if (source === 'user') {
                    const html = quillOut.root.innerHTML;
                    const text = quillOut.getText();
                    setValue("outcomesHtml", html, { shouldValidate: true, shouldDirty: true });
                    if (text.trim().length < 500) {
                        setFieldError("outcomesHtml", { type: "manual", message: "Expected Outcomes must be at least 500 characters." });
                    } else {
                        clearFieldError("outcomesHtml");
                    }
                }
            });
        }
    }, [quillOut, setValue, setFieldError, clearFieldError]);

    // Watch values for calculations
    const watchedTotalProjectCost = watch("totalProjectCost");
    const watchedGrantAmountSought = watch("grantAmountSought");
    const watchedEquipmentRows = watch("equipmentRows");
    const watchedStaffRows = watch("staffRows");
    const watchedLocationType = watch("infrastructureDetails.locationType");
    const watchedBuiltUpArea = watch("infrastructureDetails.builtUpArea");

    // Calculate State Share
    useEffect(() => {
        const t = parseInt(watchedTotalProjectCost) || 0;
        const g = parseInt(watchedGrantAmountSought) || 0;
        setValue("stateShare", t > g ? t - g : 0);
    }, [watchedTotalProjectCost, watchedGrantAmountSought, setValue]);

    // Calculate Total Cost for Equipment Rows
    useEffect(() => {
        watchedEquipmentRows?.forEach((row, index) => {
            const qty = parseInt(row.quantity) || 0;
            const uc = parseInt(row.unitCost) || 0;
            if (row.totalCost !== qty * uc) { // Only update if different to prevent infinite loops
                setValue(`equipmentRows.${index}.totalCost`, qty * uc, { shouldValidate: false, shouldDirty: true });
            }
        });
    }, [watchedEquipmentRows, setValue]);


    // Budget Pie Chart data
    const pieData = useMemo(() => {
        const equipmentSum = watchedEquipmentRows?.reduce(
            (sum, row) => sum + (parseInt(row.totalCost) || 0), 0
        ) || 0;
        const staffSum = watchedStaffRows?.reduce(
            (sum, row) => sum + (parseInt(row.monthlySalary) || 0) * (parseInt(row.duration) || 0), 0
        ) || 0;
        const infraSum = watchedLocationType
            ? (parseInt(watchedBuiltUpArea) || 0) * 1000 // Assume ₹1000/sq ft
            : 0;
        const totalCost = parseInt(watchedTotalProjectCost) || 0;
        const othersSum = Math.max(0, totalCost - (equipmentSum + staffSum + infraSum));

        return {
            labels: ["Equipment & Machinery", "Staffing", "Infrastructure", "Others"],
            datasets: [
                {
                    label: "Budget Break-Up",
                    data: [equipmentSum, staffSum, infraSum, othersSum],
                    backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#8BC34A"],
                    hoverOffset: 4,
                },
            ],
        };
    }, [watchedEquipmentRows, watchedStaffRows, watchedLocationType, watchedBuiltUpArea, watchedTotalProjectCost]);


    // Expose submitForm to parent
    useImperativeHandle(ref, () => ({
        submitForm: () => {
            handleSubmit(onValidSubmit, onInvalidSubmit)();
        },
    }));

    const onInvalidSubmit = (errors) => {
        console.error("Form validation errors:", errors);
        setError("Please correct the errors in the form.");
        // Scroll to the first error
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            // For nested fields like equipmentRows.0.equipmentName
            const fieldElement = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
            fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const onValidSubmit = async (data) => {
        setError(""); // Clear general error

        // --- Additional custom validations ---
        const tCost = parseInt(data.totalProjectCost);
        const gCost = parseInt(data.grantAmountSought);

        if (gCost > tCost * 0.6) {
            setFieldError("grantAmountSought", {
                type: "manual",
                message: "Grant cannot exceed 60% of Total Project Cost.",
            });
            setError("Grant amount exceeds allowed limit.");
            return;
        }

        // Quill content length (already handled by text-change, but good to double check)
        if ((quillObj?.getText() || "").trim().length < 500) {
            setFieldError("objectivesHtml", { type: "manual", message: "Objectives must be at least 500 characters." });
            setError("Objectives content is too short.");
            return;
        }
        if ((quillOut?.getText() || "").trim().length < 500) {
            setFieldError("outcomesHtml", { type: "manual", message: "Expected Outcomes must be at least 500 characters." });
            setError("Outcomes content is too short.");
            return;
        }

        // File validations (example for one file, extend for others)
        // This is simplified. Ideally, file validation should happen on change.
        // For RHF, custom 'validate' rule on register is better.
        const locationType = data.infrastructureDetails.locationType;
        const ownershipProofFile = data.ownershipProofFile?.[0];
        const leaseLicenseFile = data.leaseLicenseFile?.[0];

        if ((locationType === "Owned" || locationType === "Rented") && !ownershipProofFile && !existingFileNames.ownershipProofFile) {
            setFieldError("ownershipProofFile", { type: "manual", message: "Proof of ownership or lease deed is required." });
            setError("Infrastructure file missing.");
            return;
        }
        if (locationType === "Rented" && !leaseLicenseFile && !existingFileNames.leaseLicenseFile) {
            setFieldError("leaseLicenseFile", { type: "manual", message: "Lease license is required for rented locations." });
            setError("Infrastructure file missing.");
            return;
        }

        // Consolidate files
        const filesToSubmit = {
            ownershipProofFile: data.ownershipProofFile?.[0] instanceof File ? data.ownershipProofFile[0] : null,
            leaseDeedFile: data.leaseDeedFile?.[0] instanceof File ? data.leaseDeedFile[0] : null, // Assuming you add this field
            leaseLicenseFile: data.leaseLicenseFile?.[0] instanceof File ? data.leaseLicenseFile[0] : null,
            equipmentFiles: data.equipmentRows.map(row => row.vendorQuotationFile?.[0] instanceof File ? row.vendorQuotationFile[0] : null),
            registrationFiles: data.staffRows.map(row => row.registrationFile?.[0] instanceof File ? row.registrationFile[0] : null),
        };

        // Prepare data for submission (remove FileList objects, parse numbers)
        const submissionData = {
            ...data,
            totalProjectCost: parseInt(data.totalProjectCost),
            grantAmountSought: parseInt(data.grantAmountSought),
            stateShare: parseInt(data.stateShare),
            infrastructureDetails: {
                ...data.infrastructureDetails,
                builtUpArea: data.infrastructureDetails.locationType ? parseInt(data.infrastructureDetails.builtUpArea) : null,
            },
            equipmentAndMachinery: data.equipmentRows.map(row => ({
                equipmentName: row.equipmentName,
                quantity: parseInt(row.quantity),
                unitCost: parseInt(row.unitCost),
                vendorName: row.vendorName,
                totalCost: parseInt(row.totalCost),
                // vendorQuotationFile will be handled by filesToSubmit
            })),
            staffingPlan: data.staffRows.map(row => ({
                role: row.role,
                qualification: row.qualification,
                monthlySalary: parseInt(row.monthlySalary),
                duration: parseInt(row.duration),
                ayushRegistrationNumber: row.ayushRegistrationNumber,
                // registrationFile will be handled by filesToSubmit
            })),
            timeLineAndMilestones: data.milestoneRows.map(ms => ({ // Mapped from milestoneRows
                milestone: ms.milestone,
                month: parseInt(ms.month),
                deliverables: ms.deliverables,
                status: ms.status,
            })),
        };

        // Remove original file fields from submissionData as they are FileLists
        delete submissionData.ownershipProofFile;
        delete submissionData.leaseDeedFile;
        delete submissionData.leaseLicenseFile;
        // RHF would have equipmentRows still contain vendorQuotationFile: FileList
        // And staffRows would contain registrationFile: FileList.
        // The mapping above for equipmentAndMachinery and staffingPlan already omits them.


        console.log("Submitting Data:", submissionData);
        console.log("Submitting Files:", filesToSubmit);
        await onSubmit(submissionData, filesToSubmit);
    };

    const handleLocationTypeChange = (e) => {
        const newLocationType = e.target.value;
        setValue("infrastructureDetails.locationType", newLocationType);
        if (newLocationType !== "Owned" && newLocationType !== "Rented") {
            setValue("infrastructureDetails.builtUpArea", "");
            setValue("ownershipProofFile", null); // Clear file input
            setValue("leaseLicenseFile", null);   // Clear file input
            setExistingFileNames(prev => ({ ...prev, ownershipProofFile: null, leaseLicenseFile: null }));
        }
    };

    const fileValidationRules = (isRequired, existingFileName) => ({
        validate: {
            required: value => (value && value[0]) || existingFileName || !isRequired ? true : 'This file is required.',
            fileSize: value => {
                if (value && value[0]) return value[0].size <= MAX_FILE_SIZE_BYTES || `File must be ${MAX_FILE_SIZE_MB}MB or less.`;
                return true;
            },
            fileType: value => {
                if (value && value[0]) return value[0].type === "application/pdf" || 'Only PDF files are accepted.';
                return true;
            }
        }
    });


    return (
        <div>
            {error && <p className="text-red-500 mb-4 p-2 bg-red-100 border border-red-500 rounded">{error}</p>}

            {/* Project Title */}
            <div className="mb-4">
                <label htmlFor="projectTitle" className="block font-medium mb-1">
                    Project Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="projectTitle"
                    type="text"
                    className={`w-full border p-2 rounded ${errors.projectTitle ? "border-red-500" : "border-gray-300"}`}
                    maxLength={100}
                    placeholder="e.g., 30-Bed Ayurvedic Daycare Hospital in New Delhi."
                    {...register("projectTitle", {
                        required: "Project Title is required.",
                        maxLength: { value: 100, message: "Project Title cannot exceed 100 characters." },
                    })}
                />
                {errors.projectTitle && <p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>}
            </div>

            {/* Project Duration */}
            <div className="mb-4">
                <label htmlFor="projectDuration" className="block font-medium mb-1">
                    Project Duration <span className="text-red-500">*</span>
                </label>
                <select
                    id="projectDuration"
                    className={`w-full border p-2 rounded ${errors.projectDuration ? "border-red-500" : "border-gray-300"}`}
                    {...register("projectDuration", { required: "Project Duration is required." })}
                >
                    <option value="">— Select Duration —</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="24 months">24 months</option>
                </select>
                {errors.projectDuration && <p className="text-red-500 text-sm mt-1">{errors.projectDuration.message}</p>}
                <p className="text-xs text-gray-500 mt-1">NAM projects usually approved for up to 24 months.</p>
            </div>

            {/* Total Cost & Grant Sought */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label htmlFor="totalProjectCost" className="block font-medium mb-1">
                        Total Project Cost (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="totalProjectCost"
                        type="number"
                        min="0"
                        className={`w-full border p-2 rounded ${errors.totalProjectCost ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. 5000000"
                        {...register("totalProjectCost", {
                            required: "Total Project Cost is required.",
                            valueAsNumber: true,
                            min: { value: 1, message: "Must be a positive integer." },
                        })}
                    />
                    {errors.totalProjectCost && <p className="text-red-500 text-sm mt-1">{errors.totalProjectCost.message}</p>}
                    <p className="text-xs text-gray-500 mt-1">Sum of all proposed heads of expenditure.</p>
                </div>
                <div>
                    <label htmlFor="grantAmountSought" className="block font-medium mb-1">
                        Grant Amount Sought (Central Share) <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="grantAmountSought"
                        type="number"
                        min="0"
                        className={`w-full border p-2 rounded ${errors.grantAmountSought ? "border-red-500" : "border-gray-300"}`}
                        placeholder="e.g. 3000000"
                        {...register("grantAmountSought", {
                            required: "Grant Amount Sought is required.",
                            valueAsNumber: true,
                            min: { value: 1, message: "Must be a positive integer." },
                            validate: value => (parseInt(value) <= (parseInt(getValues("totalProjectCost")) || 0) * 0.6) || "Grant cannot exceed 60% of Total Project Cost."
                        })}
                    />
                    {errors.grantAmountSought && <p className="text-red-500 text-sm mt-1">{errors.grantAmountSought.message}</p>}
                    <p className="text-xs text-gray-500 mt-1">≤ 60% of Total Cost.</p>
                </div>
                <div>
                    <label htmlFor="stateShare" className="block font-medium mb-1">Minimum State Share (₹)</label>
                    <input
                        id="stateShare"
                        type="number"
                        className="w-full border p-2 rounded bg-gray-100"
                        readOnly
                        {...register("stateShare")}
                    />
                </div>
            </div>

            {/* Objectives & Outcomes */}
            <div className="mb-4">
                <label className="block font-medium mb-1">
                    Objectives <span className="text-red-500">*</span>
                </label>
                {/* Hidden input for RHF */}
                <input type="hidden" {...register("objectivesHtml", { required: "Objectives are required." })} />
                <div
                    ref={objectivesRef}
                    className={`border rounded h-40 mb-2 ${errors.objectivesHtml ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.objectivesHtml && <p className="text-red-500 text-sm">{errors.objectivesHtml.message}</p>}
                <p className="text-xs text-gray-500 mb-4">(Write at least 500 characters describing objectives.)</p>

                <label className="block font-medium mb-1">
                    Expected Outcomes <span className="text-red-500">*</span>
                </label>
                <input type="hidden" {...register("outcomesHtml", { required: "Expected Outcomes are required." })} />
                <div
                    ref={outcomesRef}
                    className={`border rounded h-40 mb-2 ${errors.outcomesHtml ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.outcomesHtml && <p className="text-red-500 text-sm">{errors.outcomesHtml.message}</p>}
                <p className="text-xs text-gray-500">(Write at least 500 characters describing outcomes.)</p>
            </div>

            {/* Infrastructure Details */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Infrastructure Details (if applicable)</label>
                <select
                    className={`w-full border p-2 rounded mb-2 ${errors.infrastructureDetails?.locationType ? "border-red-500" : "border-gray-300"}`}
                    {...register("infrastructureDetails.locationType")}
                    onChange={handleLocationTypeChange} // Custom handler to clear dependent fields
                    value={watchedLocationType || ""} // Ensure select is controlled
                >
                    <option value="">— Select Location Type —</option>
                    <option value="Owned">Own Building</option>
                    <option value="Rented">Rented Building</option>
                    <option value="Leased">Govt-Lease</option>
                </select>
                {errors.infrastructureDetails?.locationType && <p className="text-red-500 text-sm mt-1">{errors.infrastructureDetails.locationType.message}</p>}

                {(watchedLocationType === "Owned" || watchedLocationType === "Rented") && (
                    <div className="mb-2 space-y-2 p-3 border rounded">
                        <div>
                            <label htmlFor="ownershipProofFile" className="block font-medium mb-1">
                                Upload Proof of Ownership / Lease Deed <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="ownershipProofFile"
                                type="file"
                                accept=".pdf" // Changed from image/* to just pdf as per other file types
                                className={`w-full ${errors.ownershipProofFile ? "text-red-500" : ""}`}
                                {...register("ownershipProofFile", fileValidationRules(true, existingFileNames.ownershipProofFile))}
                            />
                            {watch("ownershipProofFile")?.[0] && <span className="text-sm text-gray-600 block mt-1 truncate max-w-xs">{watch("ownershipProofFile")[0].name}</span>}
                            {!watch("ownershipProofFile")?.[0] && existingFileNames.ownershipProofFile && <span className="text-sm text-gray-600 block mt-1">Current: {existingFileNames.ownershipProofFile}</span>}
                            {errors.ownershipProofFile && <p className="text-red-500 text-sm mt-1">{errors.ownershipProofFile.message}</p>}
                        </div>

                        {watchedLocationType === "Rented" && (
                            <div>
                                <label htmlFor="leaseLicenseFile" className="block font-medium mb-1">
                                    Upload Lease License <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="leaseLicenseFile"
                                    type="file"
                                    accept=".pdf"
                                    className={`w-full ${errors.leaseLicenseFile ? "text-red-500" : ""}`}
                                    {...register("leaseLicenseFile", fileValidationRules(true, existingFileNames.leaseLicenseFile))}
                                />
                                {watch("leaseLicenseFile")?.[0] && <span className="text-sm text-gray-600 block mt-1 truncate max-w-xs">{watch("leaseLicenseFile")[0].name}</span>}
                                {!watch("leaseLicenseFile")?.[0] && existingFileNames.leaseLicenseFile && <span className="text-sm text-gray-600 block mt-1">Current: {existingFileNames.leaseLicenseFile}</span>}
                                {errors.leaseLicenseFile && <p className="text-red-500 text-sm mt-1">{errors.leaseLicenseFile.message}</p>}
                            </div>
                        )}
                        <div>
                            <label htmlFor="builtUpArea" className="block font-medium mb-1">
                                Built-up Area (Sq. ft.) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="builtUpArea"
                                type="number"
                                min="0"
                                className={`w-full border p-2 rounded ${errors.infrastructureDetails?.builtUpArea ? "border-red-500" : "border-gray-300"}`}
                                {...register("infrastructureDetails.builtUpArea", {
                                    required: "Built-up Area is required.",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "Must be a positive number." },
                                })}
                            />
                            {errors.infrastructureDetails?.builtUpArea && <p className="text-red-500 text-sm mt-1">{errors.infrastructureDetails.builtUpArea.message}</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* Equipment & Machinery Table */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Equipment & Machinery</label>
                {equipmentFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-3 p-3 border rounded items-start">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Equipment Name"
                                className={`w-full border p-1 rounded ${errors.equipmentRows?.[idx]?.equipmentName ? "border-red-500" : "border-gray-300"}`}
                                {...register(`equipmentRows.${idx}.equipmentName`, { required: "Name is required." })}
                            />
                            {errors.equipmentRows?.[idx]?.equipmentName && <p className="text-red-500 text-xs mt-1">{errors.equipmentRows[idx].equipmentName.message}</p>}
                        </div>
                        <div>
                            <input
                                type="number"
                                min="1"
                                placeholder="Qty"
                                className={`w-full border p-1 rounded ${errors.equipmentRows?.[idx]?.quantity ? "border-red-500" : "border-gray-300"}`}
                                {...register(`equipmentRows.${idx}.quantity`, { required: "Qty is required.", valueAsNumber: true, min: { value: 1, message: "Min 1" } })}
                            />
                            {errors.equipmentRows?.[idx]?.quantity && <p className="text-red-500 text-xs mt-1">{errors.equipmentRows[idx].quantity.message}</p>}
                        </div>
                        <div>
                            <input
                                type="number"
                                min="0"
                                placeholder="Unit Cost"
                                className={`w-full border p-1 rounded ${errors.equipmentRows?.[idx]?.unitCost ? "border-red-500" : "border-gray-300"}`}
                                {...register(`equipmentRows.${idx}.unitCost`, { required: "Cost is required.", valueAsNumber: true, min: { value: 0, message: "Min 0" } })}
                            />
                            {errors.equipmentRows?.[idx]?.unitCost && <p className="text-red-500 text-xs mt-1">{errors.equipmentRows[idx].unitCost.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Vendor Name"
                                className={`w-full border p-1 rounded ${errors.equipmentRows?.[idx]?.vendorName ? "border-red-500" : "border-gray-300"}`}
                                {...register(`equipmentRows.${idx}.vendorName`, { required: "Vendor is required." })}
                            />
                            {errors.equipmentRows?.[idx]?.vendorName && <p className="text-red-500 text-xs mt-1">{errors.equipmentRows[idx].vendorName.message}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <input
                                type="file"
                                accept=".pdf"
                                className={`w-full text-xs ${errors.equipmentRows?.[idx]?.vendorQuotationFile ? "text-red-500" : ""}`}
                                {...register(`equipmentRows.${idx}.vendorQuotationFile`, fileValidationRules(true, existingFileNames.equipmentFiles[idx]))}
                            />
                            {watch(`equipmentRows.${idx}.vendorQuotationFile`)?.[0] && <span className="text-xs text-gray-600 block mt-1 truncate max-w-xs">{watch(`equipmentRows.${idx}.vendorQuotationFile`)[0].name}</span>}
                            {!watch(`equipmentRows.${idx}.vendorQuotationFile`)?.[0] && existingFileNames.equipmentFiles[idx] && <span className="text-xs text-gray-600 block mt-1">Current: {existingFileNames.equipmentFiles[idx]}</span>}
                            {errors.equipmentRows?.[idx]?.vendorQuotationFile && <p className="text-red-500 text-xs mt-1">{errors.equipmentRows[idx].vendorQuotationFile.message}</p>}
                        </div>
                        <div>
                            <input
                                type="number"
                                readOnly
                                placeholder="Total"
                                className="w-full border p-1 rounded bg-gray-100"
                                {...register(`equipmentRows.${idx}.totalCost`)} // Value set by useEffect
                            />
                        </div>
                        {equipmentFields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEquipment(idx)}
                                className="md:col-span-full text-sm text-red-600 hover:underline text-left md:text-right"
                            >
                                Remove Equipment
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendEquipment({ equipmentName: "", quantity: "", unitCost: "", vendorName: "", vendorQuotationFile: null, totalCost: 0 })}
                    className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                    + Add Equipment
                </button>
            </div>

            {/* Staffing Plan Table */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Staffing Plan</label>
                {staffFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3 p-3 border rounded items-start">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Role (e.g. Ayurvedacharya)"
                                className={`w-full border p-1 rounded ${errors.staffRows?.[idx]?.role ? "border-red-500" : "border-gray-300"}`}
                                {...register(`staffRows.${idx}.role`, { required: "Role is required." })}
                            />
                            {errors.staffRows?.[idx]?.role && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].role.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Qualification"
                                className={`w-full border p-1 rounded ${errors.staffRows?.[idx]?.qualification ? "border-red-500" : "border-gray-300"}`}
                                {...register(`staffRows.${idx}.qualification`, { required: "Qualification is required." })}
                            />
                            {errors.staffRows?.[idx]?.qualification && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].qualification.message}</p>}
                        </div>
                        <div>
                            <input
                                type="number" min="0" placeholder="Monthly Salary"
                                className={`w-full border p-1 rounded ${errors.staffRows?.[idx]?.monthlySalary ? "border-red-500" : "border-gray-300"}`}
                                {...register(`staffRows.${idx}.monthlySalary`, { required: "Salary is required.", valueAsNumber: true, min: { value: 0, message: "Min 0" } })}
                            />
                            {errors.staffRows?.[idx]?.monthlySalary && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].monthlySalary.message}</p>}
                        </div>
                        <div>
                            <input
                                type="number" min="1" placeholder="Duration (Months)"
                                className={`w-full border p-1 rounded ${errors.staffRows?.[idx]?.duration ? "border-red-500" : "border-gray-300"}`}
                                {...register(`staffRows.${idx}.duration`, { required: "Duration is required.", valueAsNumber: true, min: { value: 1, message: "Min 1" } })}
                            />
                            {errors.staffRows?.[idx]?.duration && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].duration.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text" placeholder="AYUSH Reg. No."
                                className={`w-full border p-1 rounded ${errors.staffRows?.[idx]?.ayushRegistrationNumber ? "border-red-500" : "border-gray-300"}`}
                                {...register(`staffRows.${idx}.ayushRegistrationNumber`, { required: "Reg. No. is required." })}
                            />
                            {errors.staffRows?.[idx]?.ayushRegistrationNumber && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].ayushRegistrationNumber.message}</p>}
                        </div>
                        <div className="md:col-span-full"> {/* Make file input take more space if needed or adjust grid */}
                            <input
                                type="file" accept=".pdf"
                                className={`w-full text-xs ${errors.staffRows?.[idx]?.registrationFile ? "text-red-500" : ""}`}
                                {...register(`staffRows.${idx}.registrationFile`, fileValidationRules(true, existingFileNames.registrationFiles[idx]))}
                            />
                            {watch(`staffRows.${idx}.registrationFile`)?.[0] && <span className="text-xs text-gray-600 block mt-1 truncate max-w-xs">{watch(`staffRows.${idx}.registrationFile`)[0].name}</span>}
                            {!watch(`staffRows.${idx}.registrationFile`)?.[0] && existingFileNames.registrationFiles[idx] && <span className="text-xs text-gray-600 block mt-1">Current: {existingFileNames.registrationFiles[idx]}</span>}
                            {errors.staffRows?.[idx]?.registrationFile && <p className="text-red-500 text-xs mt-1">{errors.staffRows[idx].registrationFile.message}</p>}
                        </div>
                        {staffFields.length > 1 && (
                            <button type="button" onClick={() => removeStaff(idx)}
                                className="md:col-span-full text-sm text-red-600 hover:underline text-left md:text-right">
                                Remove Staff
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendStaff({ role: "", qualification: "", monthlySalary: "", duration: "", ayushRegistrationNumber: "", registrationFile: null })}
                    className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                    + Add Staff
                </button>
            </div>

            {/* Timeline & Milestones */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Timeline & Milestones</label>
                {milestoneFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3 p-3 border rounded items-start">
                        <div className="md:col-span-2">
                            <input type="text" placeholder="Milestone"
                                className={`w-full border p-1 rounded ${errors.milestoneRows?.[idx]?.milestone ? "border-red-500" : "border-gray-300"}`}
                                {...register(`milestoneRows.${idx}.milestone`, { required: "Milestone is required." })}
                            />
                            {errors.milestoneRows?.[idx]?.milestone && <p className="text-red-500 text-xs mt-1">{errors.milestoneRows[idx].milestone.message}</p>}
                        </div>
                        <div>
                            <input type="number" min="1" max="24" placeholder="Month (1–24)"
                                className={`w-full border p-1 rounded ${errors.milestoneRows?.[idx]?.month ? "border-red-500" : "border-gray-300"}`}
                                {...register(`milestoneRows.${idx}.month`, { required: "Month is required.", valueAsNumber: true, min: { value: 1, message: "Min 1" }, max: { value: 24, message: "Max 24" } })}
                            />
                            {errors.milestoneRows?.[idx]?.month && <p className="text-red-500 text-xs mt-1">{errors.milestoneRows[idx].month.message}</p>}
                        </div>
                        <div>
                            <input type="text" placeholder="Deliverable"
                                className={`w-full border p-1 rounded ${errors.milestoneRows?.[idx]?.deliverables ? "border-red-500" : "border-gray-300"}`}
                                {...register(`milestoneRows.${idx}.deliverables`, { required: "Deliverables are required." })}
                            />
                            {errors.milestoneRows?.[idx]?.deliverables && <p className="text-red-500 text-xs mt-1">{errors.milestoneRows[idx].deliverables.message}</p>}
                        </div>
                        <div>
                            <select
                                className={`w-full border p-1 rounded ${errors.milestoneRows?.[idx]?.status ? "border-red-500" : "border-gray-300"}`}
                                {...register(`milestoneRows.${idx}.status`, { required: "Status is required." })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.milestoneRows?.[idx]?.status && <p className="text-red-500 text-xs mt-1">{errors.milestoneRows[idx].status.message}</p>}
                        </div>
                        {milestoneFields.length > 1 && (
                            <button type="button" onClick={() => removeMilestone(idx)}
                                className="md:col-span-full text-sm text-red-600 hover:underline text-left md:text-right">
                                Remove Milestone
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => appendMilestone({ milestone: "", month: "", deliverables: "", status: "Pending" })}
                    className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                    + Add Milestone
                </button>
            </div>

            {/* Budget Break-Up Summary (Pie chart) */}
            <div className="mb-6">
                <label className="block font-medium mb-2">Budget Break-Up Summary</label>
                <div className="max-w-md mx-auto">
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
});

export default ProposalData;