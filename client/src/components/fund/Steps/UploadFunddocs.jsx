import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { UploadCloud, Trash2, Eye } from "lucide-react";

const bytesToMB = (bytes) => bytes / 1024 / 1024;

const ALLOWED_PDF = ["application/pdf"];
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/jpg"];


const UploadFundDocs = forwardRef(({ onSubmit }, ref) => {
  const fundData = useSelector((state) => state.fund.fundData) || {};
  const { scheme, subcomponent, uploads: uploadedPaths = {} } = fundData;

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
        required: scheme !== "Others", 
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
    return base;
  }, [scheme, subcomponent]);

  const mandatoryFields = useMemo(
    () => allFields.filter((f) => f.required),
    [allFields]
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: (() => {
      const dv = {};
      allFields.forEach((f) => {
        if (f.isArray) {
          dv[f.name] = uploadedPaths[f.name] || [];
        } else {
          dv[f.name] = uploadedPaths[f.name] ? [uploadedPaths[f.name]] : [];
        }
      });
      return dv;
    })(),
  });

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

  const totalMandatory = mandatoryFields.length;

  const completedMandatoryCount = useMemo(() => {
    return mandatoryFields.reduce((count, f) => {
      const arr = filePreviews[f.name] || [];
      if (f.isArray) {
        return count + (arr.length >= (f.minCount || 1) ? 1 : 0);
      } else {
        return count + (arr.length === 1 ? 1 : 0);
      }
    }, 0);
  }, [mandatoryFields, filePreviews]);

  const percentComplete = totalMandatory
    ? Math.min(100, Math.floor((completedMandatoryCount / totalMandatory) * 100))
    : 0;

    const validateFile =
    (f) =>
    (value) => { 
      const fileList = Array.isArray(value) ? value : (value ? [value] : []);

      const presentFileCount = fileList.filter(item => item).length; 

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
      } else { 
        if (presentFileCount > 1) {
          return `Only one file allowed for ${f.label}.`;
        }
      }

      for (let item of fileList) {
        if (item instanceof File) { 
          const file = item;
          if (!f.accept.includes(file.type)) {
            return `Invalid format: ${f.label} must be ${f.accept
              .map((tp) => tp.split("/")[1])
              .join("/")} only.`;
          }
          if (bytesToMB(file.size) > f.maxSizeMB) {
            return `File too large: ${f.label} must be ≤ ${f.maxSizeMB} MB.`;
          }
        }
        
      }
      return true;
    };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      await handleSubmit(async (formValues) => {
        const payloadData = {};
        const payloadFiles = {};

        allFields.forEach((f) => {
          const arr = getValues(f.name) || [];
          if (f.isArray) {
            payloadData[f.name] = JSON.stringify(
              arr.map((item) => {
                if (typeof item === "string") {
                  return { existingPath: item };
                } else {
                  
                  return {};
                }
              })
            );
            const filesOnly = arr.filter((item) => item instanceof File);
            if (filesOnly.length) {
              payloadFiles[f.name] = filesOnly;
            }
          } else {
            const first = arr[0];
            if (typeof first === "string") {
              payloadData[f.name] = first;
            } else if (first instanceof File) {
              payloadFiles[f.name] = first;
            }
          }
        });

        await onSubmit(payloadData, payloadFiles);
      })();
    },
  }));

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

  return (
    <form className="space-y-6">
      {allFields.map((f) => {
        const errMsg = errors[f.name]?.message;
        const previews = filePreviews[f.name] || [];

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

      </form>
  );
});

export default UploadFundDocs;
