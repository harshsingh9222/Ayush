import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CompletedFund() {
  const navigate = useNavigate();
  const fundData = useSelector((s) => s.fund.currentFundData) || {};
  const refNo = fundData.applicationReferenceNumber || "—";

  return (
    <div className="text-center py-12 px-4">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Application Submitted
      </h2>
      <p className="mb-6">
        Your application has been successfully submitted. Your Reference Number is{" "}
        <span className="font-mono text-lg text-indigo-700">{refNo}</span>.
      </p>
      <p className="mb-8">
        We have sent a confirmation email and SMS with these details. 
        You may track your application status in your Dashboard.
      </p>
      <button
        onClick={() => navigate("/dashboard/funds")}
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Go to Fund Dashboard
      </button>
    </div>
  );
}
