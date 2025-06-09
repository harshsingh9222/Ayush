import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllFunds, setCurrentFund } from "../../store/Fundstate/fundSlice";
import axiosInstance from "../../utils/axios.helper";
import { useNavigate } from "react-router-dom";

const ALL_STATUSES = [
  "Draft",
  "Submitted - PendingValidation",
  "UnderStateValidation",
  "UnderTechnicalReview",
  "UnderFinancialReview",
  "PendingSiteInspection",
  "Approved",
  "FirstInstallmentDisbursed",
  "SecondInstallmentDisbursed",
  "Closed"
];

export default function FundsList() {
  const dispatch = useDispatch();
  const allFunds = useSelector((s) => s.fund.allFundsData);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/fund")
      .then((res) => dispatch(setAllFunds(res.data.data)))
      .catch(console.error);
  }, [dispatch]);

  const startNew = async () => {
    const response = await axiosInstance.post("/fund");
    console.log('response :>> ', response);
    dispatch(setCurrentFund(response.data.data));
    navigate(`/fund/${response.data.data._id}/step/0`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Grant Applications</h2>
      <button
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={startNew}
      >
        + Start New Application
      </button>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Reference No.</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Progress</th>
            <th className="p-2 border">Last Updated</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allFunds.map((f) => {
            const idx = ALL_STATUSES.indexOf(f.status);
            const pct = idx >= 0 ? ((idx + 1) / ALL_STATUSES.length) * 100 : 0;

            return (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {f.applicationReferenceNumber}
                </td>
                <td className="p-2 border">{f.status}</td>
                <td className="p-2 border w-40">
                  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-2 bg-teal-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
                <td className="p-2 border">
                  {new Date(f.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border space-x-2">
                  {f.status === "Draft" ? (
                    <button
                      className="text-indigo-600 hover:underline text-sm"
                      onClick={async () => {
                        const res = await axiosInstance.get(`/fund/${f._id}`);
                        dispatch(setCurrentFund(res.data.data));
                        navigate(
                          `/fund/${f._id}/step/${res.data.data.stepsCompleted}`
                        );
                      }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      className="text-indigo-600 hover:underline text-sm"
                      onClick={async () => {
                        const res = await axiosInstance.get(`/fund/${f._id}`);
                        dispatch(setCurrentFund(res.data.data));
                        navigate(`/fund/${f._id}/view`);
                      }}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
