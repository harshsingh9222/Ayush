import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const SelectFundType = forwardRef(({ onSubmit }, ref) => {
  const fundData = useSelector((state) => state.fund.currentFundData) || {};
  const hasAYUSHCert =
    useSelector((state) => state.business.businessData?.hasAYUSHCert) || true;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scheme: fundData.scheme || "",
      subcomponent: fundData.subcomponent || "",
    },
  });

  useEffect(() => {
    const current = getValues();
    const newScheme = fundData.scheme || "";
    const newSub = fundData.subcomponent || "";

    if (current.scheme !== newScheme || current.subcomponent !== newSub) {
      reset({
        scheme: newScheme,
        subcomponent: newSub,
      });
    }
  }, [
    fundData.scheme,
    fundData.subcomponent,
    getValues,
    reset,
  ]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onValid, onInvalid)();
    },
  }));

  const onValid = (data) => {
    if (data.scheme === "AEDS" && !hasAYUSHCert) {
      setError("scheme", {
        type: "manual",
        message:
          "You must upload a valid AYUSH Practitioner Registration under your Profile before applying under AEDS.",
      });
      return;
    }
    clearErrors();
    onSubmit({
      scheme: data.scheme,
      subcomponent: data.subcomponent,
    });
  };

  const onInvalid = () => {
  };

  const selectedScheme = watch("scheme");

  return (
    <form className="space-y-4">
      <nav className="text-sm text-gray-600 mb-4">
        Dashboard &rsaquo; Apply for Grant
      </nav>

      <h2 className="text-xl font-semibold mb-4 text-indigo-600">
        1. Select Scheme & Sub‐Component
      </h2>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <p className="font-medium mb-2">Choose Scheme:</p>
        <div className="ml-4 space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="NAM"
              {...register("scheme", {
                required: "Please select a scheme.",
              })}
              className="mr-2"
            />
            <span className="font-medium">National AYUSH Mission (NAM)</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              value="AEDS"
              {...register("scheme")}
              disabled={!hasAYUSHCert}
              className="mr-2"
            />
            <span
              className={`font-medium ${
                !hasAYUSHCert ? "text-gray-400" : ""
              }`}
            >
              AYUSH Entrepreneurship Development Scheme (AEDS)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              value="Others"
              {...register("scheme")}
              className="mr-2"
            />
            <span className="font-medium">Other Government Grants</span>
          </label>
        </div>
        {errors.scheme && (
          <p className="text-red-500 text-sm mt-1">
            {errors.scheme.message}
          </p>
        )}

        {!hasAYUSHCert && selectedScheme === "AEDS" && (
          <p className="text-red-500 text-sm mt-1">
            You must upload a valid AYUSH Practitioner Registration under your
            Profile to apply under AEDS.
          </p>
        )}
      </div>

      {selectedScheme === "NAM" && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <p className="font-medium mb-2">NAM Sub‐Components:</p>
          <div className="ml-4 space-y-2">
            {[
              {
                value: "Infrastructure",
                label: "Infrastructure",
                desc: "Establish Private AYUSH Dispensary: Up to ₹10 lakh grant.",
              },
              {
                value: "Equipment",
                label: "Equipment Acquisition",
                desc: "Panchakarma Suite: Up to ₹5 lakh for equipment.",
              },
              {
                value: "QualityLabs",
                label: "Quality Control Labs for ASU Drugs",
                desc: "Support for setting up labs: Min ₹15 lakh.",
              },
              {
                value: "MedicinalPlants",
                label: "Medicinal Plants Cultivation Projects",
                desc: "Funding: Up to ₹8 lakh/ha.",
              },
              {
                value: "CapacityBuilding",
                label: "Capacity Building / Training Centres",
                desc: "Up to ₹12 lakh for skill development.",
              },
            ].map(({ value, label, desc }) => (
              <label key={value} className="flex items-start">
                <input
                  type="radio"
                  value={value}
                  {...register("subcomponent", {
                    required: "Please select a sub‐component.",
                  })}
                  className="mt-1"
                />
                <div className="ml-2">
                  <span className="font-medium">{label}</span>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedScheme === "AEDS" && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <p className="font-medium mb-2">AEDS Sub‐Components:</p>
          <div className="ml-4 space-y-2">
            {[
              {
                value: "SeedCapital",
                label: "Seed Capital Grant",
                desc: "Up to ₹20 lakh for AYUSH micro-manufacturing. Must have a practitioner.",
              },
              {
                value: "InterestSubsidy",
                label: "Interest Subsidy on Bank Loan",
                desc: "5% interest reimbursement on AYUSH loans. Must hold AYUSH registration.",
              },
            ].map(({ value, label, desc }) => (
              <label key={value} className="flex items-start">
                <input
                  type="radio"
                  value={value}
                  {...register("subcomponent", {
                    required: "Please select a sub‐component.",
                  })}
                  className="mt-1"
                />
                <div className="ml-2">
                  <span className="font-medium">{label}</span>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedScheme === "Others" && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <p className="font-medium mb-2">Other Government Grants:</p>
          <div className="ml-4">
            <p className="text-xs text-gray-600">
              Please contact your regional AYUSH office for other available
              central/state schemes.
            </p>
          </div>
        </div>
      )}

      {errors.subcomponent && (
        <p className="text-red-500 text-sm mb-2">
          {errors.subcomponent.message}
        </p>
      )}
    </form>
  );
});

export default SelectFundType;
