// src/components/Fund/Steps/UploadFundDocs.jsx

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { UploadCloud, Trash2, Eye } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// bytes → MB
const bytesToMB = (bytes) => bytes / 1024 / 1024;

// Allowed mime types
const ALLOWED_PDF = ["application/pdf"];
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/jpg"];


const UploadFundDocs = forwardRef(({ onSubmit }, ref) => {
  // ─── Redux & previously‐saved upload‐paths ───────────────────────────────────
  const fundData = useSelector((state) => state.fund.fundData) || {};
  const { scheme, subcomponent, uploads: uploadedPaths = {} } = fundData;

  // ─── Define each field (with conditional `required`) ─────────────────────────
  const allFields = useMemo(() => {
    const base = [
      {
        name: "certificationOfBusinessPath",
        label: "Certificate of Incorporation / Registration",
        required: true,
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
      },
      {
        name: "panCardPath",
        label: "PAN Card of Entity",
        required: true,
        maxSizeMB: 1,
        accept: [...ALLOWED_PDF, ...ALLOWED_IMAGE],
      },
      {
        name: "gstRegistrationPath",
        label: "GST Registration",
        required: scheme !== "Others", // mandatory for NAM/AEDS
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
      },
      {
        name: "projectAyushPractitionCertificatePath",
        label: "AYUSH Practitioner Certificate",
        required: true,
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
      },
      {
        name: "boardResolutionPath",
        label: "Board Resolution (if company/LLP)",
        required: true,
        maxSizeMB: 1,
        accept: ALLOWED_PDF,
      },
      {
        name: "generalLandLeaseDocumentsPaths",
        label: "Land/Lease Documents (ownership proof / lease deed)",
        required: true,
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
        isArray: true,
        minCount: 1,
      },
      {
        name: "siteLayoutPlanPath",
        label: "Site Layout Plan / Sanctioned Building Plan",
        required: subcomponent === "Infrastructure",
        maxSizeMB: 3,
        accept: ALLOWED_PDF,
      },
      {
        name: "vendorQuotationPaths",
        label: "Vendor Quotations (≥ 2 required)",
        required: true,
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
        isArray: true,
        minCount: 2,
      },
      {
        name: "bankStatementPath",
        label: "Bank Statement (Last 6 Months)",
        required: true,
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
      },
      {
        name: "auditedFinancialsPaths",
        label: "Audited Financials (last 2 years)",
        required:
          subcomponent === "Equipment" || subcomponent === "QualityLabs",
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
        isArray: true,
        minCount: 1,
      },
      {
        name: "stateShareCommitmentLetterPath",
        label: "State Share Commitment Letter",
        required: scheme === "NAM",
        maxSizeMB: 2,
        accept: ALLOWED_PDF,
      },
      {
        name: "projectProposalPDFPath",
        label: "Project Proposal PDF",
        required: true,
        maxSizeMB: 5,
        accept: ALLOWED_PDF,
      },
      {
        name: "additionalSupportingDocumentsPaths",
        label: "Additional Supporting Documents (optional)",
        required: false,
        maxSizeMB: 5,
        accept: [...ALLOWED_PDF, ...ALLOWED_IMAGE],
        isArray: true,
        minCount: 0,
      },
    ];
    // We return *all* fields, but each object’s `required` flag determines if it’s mandatory
    return base;
  }, [scheme, subcomponent]);

  // Split into mandatory vs. optional for counting
  const mandatoryFields = useMemo(
    () => allFields.filter((f) => f.required),
    [allFields]
  );

  // ─── React Hook Form Setup ─────────────────────────────────────────────────
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: (() => {
      const dv = {};
      // If there is an existing saved path in fundData.uploads, load it as an array or single
      allFields.forEach((f) => {
        if (f.isArray) {
          dv[f.name] = uploadedPaths[f.name] || [];
        } else {
          // wrap a single‐path in an array, so that preview logic is consistent
          dv[f.name] = uploadedPaths[f.name] ? [uploadedPaths[f.name]] : [];
        }
      });
      return dv;
    })(),
  });

  // ─── Local state for “preview” URLs ─────────────────────────────────────────
  //   filePreviews[f.name] = Array of { name, url }
  const [filePreviews, setFilePreviews] = useState(() => {
    const init = {};
    allFields.forEach((f) => {
      const raw = uploadedPaths[f.name];
      if (f.isArray) {
        init[f.name] = Array.isArray(raw)
          ? raw.map((p) => ({ name: p.split("/").pop(), url: `/file/${p}` }))
          : [];
      } else {
        init[f.name] = raw
          ? [{ name: raw.split("/").pop(), url: `/file/${raw}` }]
          : [];
      }
    });
    return init;
  });

  // ─── Count how many mandatory fields are already “complete” ────────────────
  const totalMandatory = mandatoryFields.length;

  const completedMandatoryCount = useMemo(() => {
    return mandatoryFields.reduce((count, f) => {
      const arr = filePreviews[f.name] || [];
      if (f.isArray) {
        // if the array has at least `minCount` entries
        return count + (arr.length >= (f.minCount || 1) ? 1 : 0);
      } else {
        // if exactly one file is present (for single‐file field)
        return count + (arr.length === 1 ? 1 : 0);
      }
    }, 0);
  }, [mandatoryFields, filePreviews]);

  // Compute final percentage, capped at 100%
  const percentComplete = totalMandatory
    ? Math.min(100, Math.floor((completedMandatoryCount / totalMandatory) * 100))
    : 0;

  // ─── Helper: validate file(s) for each field ──────────────────────────────
    const validateFile =
    (f) =>
    (value) => { // `value` is what RHF gives us: an array of (string paths OR File objects)
      const fileList = Array.isArray(value) ? value : (value ? [value] : []);

      // --- Check for presence based on `required` and `minCount` ---
      // This part needs to consider both string paths and File objects for its count.
      const presentFileCount = fileList.filter(item => item).length; // Count non-empty items

      if (presentFileCount === 0) {
        return !f.required
          ? true
          : f.isArray
          ? `Please upload at least ${f.minCount || 1} file(s).`
          : `${f.label} is required.`;
      }

      if (f.isArray) {
        if (presentFileCount < (f.minCount || 1)) {
          return `Please upload at least ${f.minCount || 1} file(s).`;
        }
      } else { // Not an array field
        if (presentFileCount > 1) {
          return `Only one file allowed for ${f.label}.`;
        }
      }

      // --- Check type & size ONLY for actual File objects (new uploads) ---
      for (let item of fileList) {
        if (item instanceof File) { // Only validate File objects
          const file = item; // for clarity
          if (!f.accept.includes(file.type)) {
            return `Invalid format: ${f.label} must be ${f.accept
              .map((tp) => tp.split("/")[1])
              .join("/")} only.`;
          }
          if (bytesToMB(file.size) > f.maxSizeMB) {
            return `File too large: ${f.label} must be ≤ ${f.maxSizeMB} MB.`;
          }
        }
        // If item is a string (existing path), we skip type/size validation for it.
      }
      return true;
    };

  // ─── Expose submitForm() to parent via ref ─────────────────────────────────
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      // 1) Trigger RHF validation
      await handleSubmit(async (formValues) => {
        // formValues[f.name] is an array of either "string paths" or File objects
        // Build two parallel objects: payloadData (for JSON fields) + payloadFiles (for actual File uploads)
        const payloadData = {};
        const payloadFiles = {};

        allFields.forEach((f) => {
          const arr = getValues(f.name) || [];
          if (f.isArray) {
            // Our backend expects a JSON‐stringified array (e.g. of previously saved paths)
            payloadData[f.name] = JSON.stringify(
              arr.map((item) => {
                if (typeof item === "string") {
                  return { existingPath: item };
                } else {
                  // newly selected File → actual upload
                  return {};
                }
              })
            );
            // Now collect all File objects under the same key:
            const filesOnly = arr.filter((item) => item instanceof File);
            if (filesOnly.length) {
              payloadFiles[f.name] = filesOnly;
            }
          } else {
            // single‐file field: either a string path or a File
            const first = arr[0];
            if (typeof first === "string") {
              payloadData[f.name] = first;
            } else if (first instanceof File) {
              payloadFiles[f.name] = first;
            }
          }
        });

        // 2) Finally call parent onSubmit
        await onSubmit(payloadData, payloadFiles);
      })();
    },
  }));

  // ─── When user selects files, update both RHF state and preview state ──────
  const onFilesSelected = (fieldName, e) => {
    const fileList = Array.from(e.target.files || []);
    setFilePreviews((prev) => ({
      ...prev,
      [fieldName]: fileList.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    }));
    setValue(fieldName, fileList, { shouldValidate: true });
  };

  // ─── Remove a single preview (and also remove from RHF) ───────────────────
  const removeFile = (fieldName, index) => {
    setFilePreviews((prev) => {
      const copy = [...(prev[fieldName] || [])];
      copy.splice(index, 1);
      return { ...prev, [fieldName]: copy };
    });
    const current = getValues(fieldName) || [];
    current.splice(index, 1);
    setValue(fieldName, current, { shouldValidate: true });
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <form className="space-y-6">
      {allFields.map((f) => {
        const errMsg = errors[f.name]?.message;
        const previews = filePreviews[f.name] || [];

        // If a field is conditionally not required and we want to hide it completely:
        // if (!f.required && <someConditionToHide>) return null;

        return (
          <div key={f.name}>
            <label className="block font-medium mb-1">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>

            <Controller
              name={f.name}
              control={control}
              rules={{ validate: validateFile(f) }}
              render={({ field }) => (
                <input
                  type="file"
                  accept={f.accept.join(",")}
                  multiple={!!f.isArray}
                  onChange={(e) => onFilesSelected(f.name, e)}
                  className="block w-full border border-gray-300 rounded p-2 cursor-pointer"
                />
              )}
            />
            {errMsg && <p className="text-red-500 text-sm mt-1">{errMsg}</p>}

            {/* Show preview list */}
            {previews.length > 0 && (
              <ul className="mt-2 space-y-1">
                {previews.map((p, idx) => (
                  <li
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Eye
                        size={16}
                        className="cursor-pointer text-indigo-600"
                        onClick={() => window.open(p.url, "_blank")}
                      />
                      <span className="text-sm">{p.name}</span>
                    </div>
                    <Trash2
                      size={16}
                      className="cursor-pointer text-red-600"
                      onClick={() => removeFile(f.name, idx)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {/* Progress Bar */}
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">
          {completedMandatoryCount} of {totalMandatory} mandatory documents uploaded
        </p>
        <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
          <div
            className="h-2 bg-teal-500 transition-all duration-200"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* “Next: Review & Submit” button lives in parent Fund.jsx */}
    </form>
  );
});

export default UploadFundDocs;
