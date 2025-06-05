import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function CompanyDashboard() {
    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const representativeStatus = useSelector((state) => state.representative.status);
    const representativeData = useSelector((state) => state.representative.representativeData);
    const businessStatus = useSelector((state) => state.business.status);
    const businessData = useSelector((state) => state.business.businessData);

    const steps = [
        "Personal Information",
        "Personal Documents",
        "Business Information",
        "Business Documents",
        "Verification"
    ];

    useEffect(() => {
        if (!authStatus) navigate("/login");
        if (!representativeStatus) navigate("/step");
    }, [authStatus, representativeStatus, navigate, userData]);

    const stepsCompleted = representativeData?.stepsCompleted || 0;

    const statusColor = {
        "Pending": "text-yellow-500",
        "Approved": "text-green-600",
        "Rejected": "text-red-600"
    };

    const statusSymbol = {
        "Pending": "🟡",
        "Approved": "✅",
        "Rejected": "❌"
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-10">
                <div className="flex justify-between items-center">
                    {steps.map((step, index) => (
                        <div className="flex flex-col items-center w-1/5 relative" key={index}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${index < stepsCompleted ? "bg-teal-500" : "bg-gray-300"}`}>
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <p className={`text-xs mt-2 text-center font-medium 
                                ${index < stepsCompleted ? "text-teal-600" : "text-gray-500"}`}>
                                {step.toUpperCase()}
                            </p>
                            {index < steps.length - 1 && (
                                <div className={`absolute top-5 left-full h-1 w-full 
                                    ${index < stepsCompleted - 1 ? "bg-teal-500" : "bg-gray-300"}`}>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Representative Info */}
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Representative Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div><span className="font-semibold">Name:</span> {representativeData?.name || 'N/A'}</div>
                    <div><span className="font-semibold">Email:</span> {representativeData?.email || 'N/A'}</div>
                    <div><span className="font-semibold">PAN No:</span> {representativeData?.panNo || 'N/A'}</div>
                    <div><span className="font-semibold">Position:</span> {representativeData?.position || 'N/A'}</div>
                    <div><span className="font-semibold">State:</span> {representativeData?.state || 'N/A'}</div>
                    <div><span className="font-semibold">Address:</span> {representativeData?.addressLine1 || 'N/A'}</div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-indigo-500 mb-2">Step Completion Status</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {steps.map((step, idx) => (
                            <li key={idx}>
                                <span className="font-medium">{step}:</span> {idx < stepsCompleted ? '✅ Completed' : '❌ Pending'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Business Info */}
            <div className="max-w-3xl mx-auto">
                {!businessStatus ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="mb-4 text-gray-700 text-lg font-medium">You haven’t submitted your business details yet.</p>

                        {/* here i am used button as the we had discussed the concept of the Business reprenstative and
                        Employee till now it is available for every one as the Employee is added if will open it only for the Representative...  */}

                        <button
                            onClick={() => navigate("/step")}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Add Business Information
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-indigo-600 mb-4 text-center">Business Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                            <div><span className="font-semibold">Business Name:</span> {businessData?.businessName || 'N/A'}</div>
                            <div>
                                <span className="font-semibold">Status:</span> 
                                <span className={`ml-2 font-bold ${statusColor[businessData?.status]}`}>
                                    {statusSymbol[businessData?.status]} {businessData?.status}
                                </span>
                            </div>
                            <div><span className="font-semibold">Email:</span> {businessData?.email || 'N/A'}</div>
                            <div><span className="font-semibold">Mobile Number:</span> {businessData?.mobileNo || 'N/A'}</div>
                            <div><span className="font-semibold">State:</span> {businessData?.state || 'N/A'}</div>
                            <div><span className="font-semibold">District:</span> {businessData?.district || 'N/A'}</div>
                            <div><span className="font-semibold">Address Line 1:</span> {businessData?.addressLine1 || 'N/A'}</div>
                            <div><span className="font-semibold">Address Line 2:</span> {businessData?.addressLine2 || 'N/A'}</div>
                            <div><span className="font-semibold">Postal Code:</span> {businessData?.postalCode || 'N/A'}</div>
                            <div><span className="font-semibold">Registration Date:</span> {businessData?.registrationDate?.split('T')[0] || 'N/A'}</div>
                            <div className="md:col-span-2"><span className="font-semibold">Registration Number:</span> {businessData?.registrationNumber || 'N/A'}</div>
                            <div className="md:col-span-2">
                                <span className="font-semibold">Sectors:</span>{" "}
                                {businessData?.sectors?.length > 0 ? (
                                    <span className="ml-2 font-medium text-indigo-700">
                                        {businessData.sectors.join(", ")}
                                    </span>
                                ) : 'N/A'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/** here comes the logic of the loan apply for the loan for the  
            */}

            <button
                onClick={() => navigate("/fund")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mt-6 block mx-auto"
            >
                Apply for funds
            </button>

            {/* here i will write the logic of the if any campegin is currently running or not or completed 
            and some details about the campegin */}
        </div>
    );
}

export default CompanyDashboard;
