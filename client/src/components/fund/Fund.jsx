import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import SelectFundType from "./Steps/selectFundType";
import ProposalData from "./Steps/ProposalData";
import UploadFundDocs from "./Steps/UploadFunddocs";
import ReviewSubmission from "./Steps/ReviewSubmission";
import CompletedFund from "./Steps/CompletedFund";
import { CheckCircle } from "lucide-react";
import { addFund } from "../../store/Fundstate/fundSlice";
import { getCurrentFund } from "../../hooks/getCurrentFund";

const steps = [
  "Select Fund Type",
  "Proposal Data",
  "Upload Documents",
  "Review & Submit",
];

export default function Fund() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const businessStatus = useSelector((state) => state.business.status);
  const fundData = useSelector((state) => state.fund.fundData);
  const fundStatus = useSelector((state) => state.fund.status);

  const [currStep, setCurrStep] = useState(0);
  const [maxStepCompleted, setMaxStepCompleted] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const formRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
      return;
    }
    if (!businessStatus) {
      navigate("/step");
      return;
    }
    navigate("/fund");
    if (fundStatus === false) {
      getCurrentFund(dispatch);
    }
    // Pull stepsCompleted from Redux (persisted by your handleStepSubmit)
    const stepsCompleted = fundData?.stepsCompleted || 0;
    setCurrStep(stepsCompleted);
    setMaxStepCompleted(stepsCompleted);
  }, [authStatus, businessStatus, fundData, fundStatus, navigate, dispatch]);

  // Called when “Next / Previous / Submit” buttons are clicked
  const handleClick = async (direction) => {
    if (direction === "Submit") {
      // Trigger the final step’s form (ReviewSubmission) if it has a submitForm() method
      try {
        const currentRef = formRefs[currStep]?.current;
        if (currentRef && typeof currentRef.submitForm === "function") {
          await currentRef.submitForm();
        } else {
          // No submitForm in ReviewSubmission?  Fall back to do a final POST:
          await submitFinalApplication();
        }
      } catch (err) {
        console.error("Error submitting final fund application:", err);
      }
      return;
    }

    if (direction === "Next") {
      if (currStep + 1 > maxStepCompleted) {
        return;
      }
      setCurrStep((prev) => Math.min(prev + 1, steps.length));
      return;
    }

    setCurrStep((prev) => Math.max(prev - 1, 0));
  };

  // Each step calls this callback when its “form” is successfully validated & posted
  // AFTER: unpack both data and files
  const handleStepSubmit = (step) => async (data, files = {}) => {
    console.log("Form data for step", step, ":", data);
    console.log("Files for step", step, ":", files);

    // if(step===steps.length) await submitFinalApplication()

    const formData = new FormData();

    // 1) Append JSON fields exactly as strings (arrays become JSON)
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // arrays → JSON
        formData.append(key, JSON.stringify(value));
      } else if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof File) &&
        !(value instanceof Blob)
      ) {
        // plain objects → JSON
        formData.append(key, JSON.stringify(value));
      } else {
        // string, number, boolean, File, Blob, etc.
        formData.append(key, value);
      }
    });
    // 2) Append files under exactly the fieldnames the controller expects:
    // Proposal uploads:
    if (step === 1) {
      // Infrastructure uploads:
      if (files.ownershipProofFile instanceof File) {
        formData.append(
          "infrastructureDetails.ownershipProofFile",
          files.ownershipProofFile
        );
      }
      if (files.leaseDeedFile instanceof File) {
        formData.append(
          "infrastructureDetails.leaseDeedFile",
          files.leaseDeedFile
        );
      }
      if (files.leaseLicenseFile instanceof File) {
        formData.append(
          "infrastructureDetails.leaseLicenseFile",
          files.leaseLicenseFile
        );
      }

      // Equipment PDFs (one or more):
      if (Array.isArray(files.equipmentFiles)) {
        files.equipmentFiles.forEach((f) => {
          if (f instanceof File) {
            formData.append("equipmentFiles", f);
          }
        });
      }

      // Staffing registration PDFs (one or more):
      if (Array.isArray(files.registrationFiles)) {
        files.registrationFiles.forEach((f) => {
          if (f instanceof File) {
            formData.append("registrationFiles", f);
          }
        });
      }
    }

    if (step === 2) {
      Object.entries(files).forEach(([fieldName, maybeFiles]) => {
        if (!maybeFiles) return;
        if (Array.isArray(maybeFiles)) {
          maybeFiles.forEach((f) => formData.append(fieldName, f));
        } else if (maybeFiles instanceof File) {
          formData.append(fieldName, maybeFiles);
        }
      });
    }

    // console.log('formData :>> ', formData);

    // 3) Finally send it off:
    try {
      const response = await axiosInstance.post(
        `/fund/step-apply/${step}`,
        formData
      );
      console.log("Response from server (fund step):", response);
      if (response.data?.data) {
        dispatch(addFund(response.data.data));
      }
      setMaxStepCompleted((prev) => Math.max(prev, step + 1));
      setCurrStep((prev) => Math.min(prev + 1, steps.length));
    } catch (error) {
      console.error("Error in step", step, ":", error);
    }
  };

  // If user somehow clicks “Submit” on the final review step but we haven’t implemented submitForm():
  const submitFinalApplication = async () => {
    try {
      // If your backend expects a final flag, or no extra data, just call:
      const response = await axiosInstance.post(`/fund/complete-application`);
      console.log("Final application response:", response);
      // Move to “CompletedFund” screen
      setCurrStep(steps.length);
    } catch (err) {
      console.error("Error completing fund application:", err);
    }
  };

  const displayStep = (step) => {
    switch (step) {
      case 0:
        return (
          <SelectFundType
            ref={formRefs[0]}
            onSubmit={handleStepSubmit(0)}
            existingData={{ hasAYUSHCert: true }}
          />
        );
      case 1:
        return (
          <ProposalData
            ref={formRefs[1]}
            onSubmit={handleStepSubmit(1)}
            existingData={{}}
          />
        );
      case 2:
        return (
          <UploadFundDocs
            ref={formRefs[2]}
            onSubmit={handleStepSubmit(2)}
            existingData={{}}
          />
        );
      case 3:
        return (
          <ReviewSubmission
            ref={formRefs[3]}
            onSubmit={async () => {
              await submitFinalApplication();
            }}
            goToStep={(s) => setCurrStep(s)}
            collectedData={{}}
          />
        );
      case 4:
        return <CompletedFund />;
      default:
        return <div className="text-red-500">Invalid Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row">
      <div className="relative flex flex-col items-center mr-4">
        {/* Collapse/Expand Toggle */}
        <button
          onClick={toggleSidebar}
          className="mb-4 text-indigo-600 focus:outline-none"
        >
          {isOpen ? "«" : "»"}
        </button>
        <Stepper steps={steps} currStep={currStep} isOpen={isOpen} />
      </div>
      <div className="flex-1">
        {/* Current Step Title */}
        {currStep < steps.length && (
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            {steps[currStep]}
          </h2>
        )}

        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          {displayStep(currStep)}
        </div>

        {currStep < steps.length && (
          <div className="flex justify-between">
            <StepperControl
              handleClick={handleClick}
              currStep={currStep}
              steps={steps}
            />
          </div>
        )}
      </div>
    </div>
  );
}
// This component handles the multi-step fund application process.
// It allows users to select a fund type, upload documents, review their submission, and reach a completion screen.
// The sidebar is collapsible, showing only step numbers when collapsed, and revealing step titles when expanded.
