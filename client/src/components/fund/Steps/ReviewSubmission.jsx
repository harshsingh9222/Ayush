// src/components/Fund/Steps/ReviewSubmission.jsx

import React, {
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { CheckCircle, AlertCircle } from "lucide-react"; // ExclamationCircle was renamed

ChartJS.register(ArcElement, Tooltip, Legend);

const ReviewSubmission = forwardRef(({ onSubmit, goToStep }, ref) => {
  const fundData = useSelector((state) => state.fund.fundData) || {};

  // ─── Step 2 fields ────────────────────────────────────────────────────────────
  const {
    projectTitle,
    projectDuration,
    totalProjectCost,
    grantAmountSought,
    infrastructureDetails = {},
    objectivesHtml = "",
    outcomesHtml = "",
    equipmentAndMachinery = [],
    staffingPlan = [],
    timeLineAndMilestones = [],
  } = fundData;

  // Compute stateShare
  const stateShare =
    fundData.stateShare != null
      ? fundData.stateShare
      : totalProjectCost != null && grantAmountSought != null
      ? totalProjectCost - grantAmountSought
      : 0;

  // ─── Step 3 uploads ────────────────────────────────────────────────────────────
  const uploads = fundData.uploads || {};
  const {
    certificationOfBusinessPath,
    panCardPath,
    gstRegistrationPath,
    projectAyushPractitionCertificatePath,
    boardResolutionPath,
    generalLandLeaseDocumentsPaths = [],
    siteLayoutPlanPath,
    vendorQuotationPaths = [],
    bankStatementPath,
    auditedFinancialsPaths = [],
    stateShareCommitmentLetterPath,
    projectProposalPDFPath,
    additionalSupportingDocumentsPaths = [],
  } = uploads;

  // ─── Panel completeness checks ────────────────────────────────────────────────
  const isProposalComplete = useMemo(() => {
    if (
      projectTitle &&
      projectDuration &&
      totalProjectCost != null &&
      grantAmountSought != null &&
      objectivesHtml &&
      outcomesHtml
    ) {
      return (
        equipmentAndMachinery.length > 0 &&
        staffingPlan.length > 0 &&
        timeLineAndMilestones.length > 0
      );
    }
    return false;
  }, [
    projectTitle,
    projectDuration,
    totalProjectCost,
    grantAmountSought,
    objectivesHtml,
    outcomesHtml,
    equipmentAndMachinery,
    staffingPlan,
    timeLineAndMilestones,
  ]);

  const isDocumentsComplete = useMemo(() => {
    if (!certificationOfBusinessPath) return false;
    if (!panCardPath) return false;
    if (fundData.scheme !== "Others" && !gstRegistrationPath) return false;
    if (!projectAyushPractitionCertificatePath) return false;
    if (!boardResolutionPath) return false;
    if (generalLandLeaseDocumentsPaths.length < 1) return false;
    if (fundData.subcomponent === "Infrastructure" && !siteLayoutPlanPath)
      return false;
    if (vendorQuotationPaths.length < 2) return false;
    if (!bankStatementPath) return false;
    if (
      ["Equipment", "QualityLabs"].includes(fundData.subcomponent) &&
      auditedFinancialsPaths.length < 1
    )
      return false;
    if (fundData.scheme === "NAM" && !stateShareCommitmentLetterPath)
      return false;
    if (!projectProposalPDFPath) return false;
    return true;
  }, [
    certificationOfBusinessPath,
    panCardPath,
    gstRegistrationPath,
    projectAyushPractitionCertificatePath,
    boardResolutionPath,
    generalLandLeaseDocumentsPaths,
    siteLayoutPlanPath,
    vendorQuotationPaths,
    bankStatementPath,
    auditedFinancialsPaths,
    stateShareCommitmentLetterPath,
    projectProposalPDFPath,
    fundData.scheme,
    fundData.subcomponent,
  ]);

  // ─── Financial chart data ───────────────────────────────────────────────────
  const pieData = useMemo(() => {
    const equipSum = equipmentAndMachinery.reduce(
      (sum, row) => sum + (row.totalCost || 0),
      0
    );
    const staffSum = staffingPlan.reduce(
      (sum, row) => sum + (row.monthlySalary || 0) * (row.duration || 0),
      0
    );
    const infraSum =
      infrastructureDetails.locationType && infrastructureDetails.builtUpArea
        ? infrastructureDetails.builtUpArea * 1000
        : 0;
    const t = totalProjectCost || 0;
    const other = Math.max(t - (equipSum + staffSum + infraSum), 0);

    return {
      labels: [
        "Equipment & Machinery",
        "Staffing",
        "Infrastructure",
        "Others",
      ],
      datasets: [
        {
          label: "Budget Break-Up",
          data: [equipSum, staffSum, infraSum, other],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#8BC34A"],
          hoverOffset: 4,
        },
      ],
    };
  }, [
    equipmentAndMachinery,
    staffingPlan,
    infrastructureDetails,
    totalProjectCost,
  ]);

  // ─── “I Agree” checkbox ─────────────────────────────────────────────────────
  const [agreed, setAgreed] = useState(false);

  // Expose submitForm() to parent via ref:
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (!agreed) return; // do nothing if not checked
      const confirmed = window.confirm(
        "Are you sure you want to submit? Once submitted, you cannot edit this proposal. You will receive an Application Reference Number and may respond to any queries through your Dashboard."
      );
      if (confirmed) {
        onSubmit({});
      }
    },
  }));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-indigo-600">
        4. Review & Submit
      </h2>

      <div className="space-y-4">
        {/* Proposal Details Panel */}
        <div className="border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
            <div className="flex items-center space-x-2">
              {isProposalComplete ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <span className="font-medium">Proposal Details</span>
            </div>
            <button
              onClick={() => goToStep(1)}
              className="text-indigo-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Project Title:</p>
                <p className="font-medium">{projectTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Project Duration:</p>
                <p className="font-medium">{projectDuration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Project Cost:</p>
                <p className="font-medium">₹ {totalProjectCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Grant Amount Sought:
                </p>
                <p className="font-medium">₹ {grantAmountSought}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State Share:</p>
                <p className="font-medium">₹ {stateShare}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">Objectives:</p>
              <div
                className="prose max-w-none border p-3 rounded bg-gray-50"
                dangerouslySetInnerHTML={{ __html: objectivesHtml }}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Expected Outcomes:</p>
              <div
                className="prose max-w-none border p-3 rounded bg-gray-50"
                dangerouslySetInnerHTML={{ __html: outcomesHtml }}
              />
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">Infrastructure Details:</p>
              <p className="font-medium">
                {infrastructureDetails.locationType || "-"}
                {infrastructureDetails.builtUpArea
                  ? `, Built-up Area: ${infrastructureDetails.builtUpArea} sq. ft.`
                  : ""}
              </p>
            </div>

            {/* Equipment & Machinery */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">
                Equipment &amp; Machinery:
              </p>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    <th className="border px-2 py-1 text-right">Unit Cost</th>
                    <th className="border px-2 py-1 text-right">Total Cost</th>
                    <th className="border px-2 py-1 text-left">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentAndMachinery.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{row.equipmentName}</td>
                      <td className="border px-2 py-1 text-right">
                        {row.quantity}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹ {row.unitCost}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹ {row.totalCost}
                      </td>
                      <td className="border px-2 py-1">{row.vendorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Staffing Plan */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Staffing Plan:</p>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left">Role</th>
                    <th className="border px-2 py-1 text-left">
                      Qualification
                    </th>
                    <th className="border px-2 py-1 text-right">Salary/mo</th>
                    <th className="border px-2 py-1 text-right">Duration</th>
                    <th className="border px-2 py-1 text-left">
                      AYUSH Reg. No.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffingPlan.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{row.role}</td>
                      <td className="border px-2 py-1">{row.qualification}</td>
                      <td className="border px-2 py-1 text-right">
                        ₹ {row.monthlySalary}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {row.duration} mo
                      </td>
                      <td className="border px-2 py-1">
                        {row.ayushRegistrationNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Timeline & Milestones */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">
                Timeline &amp; Milestones:
              </p>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left">Milestone</th>
                    <th className="border px-2 py-1 text-center">Month</th>
                    <th className="border px-2 py-1 text-left">Deliverable</th>
                    <th className="border px-2 py-1 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {timeLineAndMilestones.map((ms, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{ms.milestone}</td>
                      <td className="border px-2 py-1 text-center">
                        {ms.month}
                      </td>
                      <td className="border px-2 py-1">{ms.deliverables}</td>
                      <td className="border px-2 py-1 text-center">
                        {ms.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Uploaded Documents Panel */}
        <div className="border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
            <div className="flex items-center space-x-2">
              {isDocumentsComplete ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <span className="font-medium">Uploaded Documents</span>
            </div>
            <button
              onClick={() => goToStep(2)}
              className="text-indigo-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
          <div className="px-4 py-4 space-y-4">
            {[
              {
                label: "Certificate of Incorporation",
                path: certificationOfBusinessPath,
              },
              { label: "PAN Card of Entity", path: panCardPath },
              { label: "GST Registration", path: gstRegistrationPath },
              {
                label: "AYUSH Practitioner Certificate",
                path: projectAyushPractitionCertificatePath,
              },
              { label: "Board Resolution", path: boardResolutionPath },
              {
                label: "Land/Lease Documents",
                pathList: generalLandLeaseDocumentsPaths,
              },
              {
                label: "Site Layout Plan",
                path: siteLayoutPlanPath,
              },
              {
                label: "Vendor Quotations",
                pathList: vendorQuotationPaths,
              },
              { label: "Bank Statement", path: bankStatementPath },
              {
                label: "Audited Financials",
                pathList: auditedFinancialsPaths,
              },
              {
                label: "State Share Commitment Letter",
                path: stateShareCommitmentLetterPath,
              },
              {
                label: "Project Proposal PDF",
                path: projectProposalPDFPath,
              },
              {
                label: "Additional Supporting Documents",
                pathList: additionalSupportingDocumentsPaths,
              },
            ].map((doc, idx) => {
              if (doc.pathList) {
                return (
                  <div key={idx}>
                    <p className="text-sm text-gray-600 mb-1">
                      {doc.label}:
                    </p>
                    <ul className="pl-4 list-disc space-y-1">
                      {doc.pathList.length > 0 ? (
                        doc.pathList.map((p, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <a
                              href={`/file/${p}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline text-sm"
                            >
                              Download
                            </a>
                            <span className="text-sm">{p.split("/").pop()}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-red-500">Not uploaded</li>
                      )}
                    </ul>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600 w-56">{doc.label}:</p>
                    {doc.path ? (
                      <>
                        <a
                          href={`/file/${doc.path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          Download
                        </a>
                        <span className="text-sm">
                          {doc.path.split("/").pop()}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-red-500">
                        Not uploaded
                      </span>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Financial Summary Panel */}
        <div className="border rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="font-medium">Financial Summary</span>
            </div>
            <button
              onClick={() => goToStep(1)}
              className="text-indigo-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
          <div className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Total Project Cost:</p>
                <p className="font-medium">₹ {totalProjectCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Central Share:</p>
                <p className="font-medium">₹ {grantAmountSought}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State Share:</p>
                <p className="font-medium">₹ {stateShare}</p>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>

      {/* I Agree (no button here; parent Fund.jsx calls submitForm()) */}
      <div className="mt-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-sm text-gray-700">
            I, the undersigned, hereby certify that all information provided is
            true to the best of my knowledge. I agree to abide by the terms and
            conditions of the selected AYUSH scheme and will submit
            Utilization Certificates and Progress Reports as required.
          </span>
        </label>
      </div>
    </div>
  );
});

export default ReviewSubmission;
