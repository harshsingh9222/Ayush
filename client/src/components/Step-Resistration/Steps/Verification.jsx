import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../../../utils/axios.helper';

const Verification = forwardRef(({ onSubmit }, ref) => {
  const representativeStatus = useSelector((state) => state.representative.status);
  const representativeData = useSelector((state) => state.representative.representativeData);
  const businessData = useSelector((state) => state.business.businessData);
  
  console.log("Representative Status:", representativeStatus);
  console.log("Representative Data:", representativeData);
  console.log("Business Data:", businessData);
  // State for verification status and OTP
  const [verificationStatus, setVerificationStatus] = useState({
    representativeMobile: { verified: false, loading: false, error: null },
    representativeEmail: { verified: false, loading: false, error: null },
    businessMobile: { verified: false, loading: false, error: null },
    businessEmail: { verified: false, loading: false, error: null },
  });
  
  const [otpState, setOtpState] = useState({
    representativeMobile: { show: false, otp: ['', '', '', '', '', ''] },
    representativeEmail: { show: false, otp: ['', '', '', '', '', ''] },
    businessMobile: { show: false, otp: ['', '', '', '', '', ''] },
    businessEmail: { show: false, otp: ['', '', '', '', '', ''] },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      registrationNumber: businessData?.registrationNumber || '',
      representativeMobile: representativeData?.mobileNo || '',
      representativeEmail: representativeData?.email || '',
      businessMobile: businessData?.mobileNo || '',
      businessEmail: businessData?.email || '',
    },
  });

  useEffect(() => {
    if (representativeStatus) {
      reset({
        registrationNumber: businessData?.registrationNumber || '',
        representativeMobile: representativeData?.mobileNo || '',
        representativeEmail: representativeData?.email || '',
        businessMobile: businessData?.mobileNo || '',
        businessEmail: businessData?.email || '',
      });
      
      // Reset verification status when data changes
      setVerificationStatus({
        representativeMobile: { verified: representativeData?.mobileNo ? true : false, loading: false, error: null },
        representativeEmail: { verified: representativeData?.email, loading: false, error: null },
        businessMobile: { verified: businessData?.mobileNo, loading: false, error: null },
        businessEmail: { verified: businessData?.email, loading: false, error: null },
      });

      console.log(businessData?.registrationNumber, businessData?.mobileNo, businessData?.email, representativeData?.mobileNo, representativeData?.email);
    }
  }, [representativeStatus, representativeData, businessData, reset]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      // Check if all fields are verified
      const allVerified = Object.values(verificationStatus).every(
        status => status.verified
      );
      
      if (!allVerified) {
        return {
          success: false,
          message: 'Please verify all fields before submitting'
        };
      }
      
      return handleSubmit(onSubmit)();
    },
  }));

  const handleOtpChange = (e, index, fieldKey) => {
    const value = e.target.value.replace(/\D/, '');
    if (value.length > 1) return;

    const updatedOtp = [...otpState[fieldKey].otp];
    updatedOtp[index] = value;

    setOtpState(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        otp: updatedOtp,
      },
    }));

    if (value && index < 5) {
      const nextInput = document.getElementById(`${fieldKey}-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderOtpInputs = (fieldKey) => {
    if(verificationStatus[fieldKey].verified) {
      return null; // Don't show OTP inputs if already verified
    }
    return (
      <div className="mt-3">
        <div className="flex space-x-2 justify-center">
          {otpState[fieldKey].otp.map((digit, index) => (
            <input
              key={index}
              id={`${fieldKey}-otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index, fieldKey)}
              className="w-10 h-10 text-center text-md rounded-xl border border-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-500"
            />
          ))}
        </div>
        {verificationStatus[fieldKey].error && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {verificationStatus[fieldKey].error}
          </p>
        )}
      </div>
    );
  };

  // Function to send OTP to backend
  const sendOtpToBackend = async (fieldKey, value) => {
    try {
  
      if(fieldKey === "representativeMobile" || fieldKey === "businessMobile") return true
      const response = await axiosInstance.post('/auth/send-otp', { type: fieldKey, email: value });
      console.log('Successfully sent OTP:', response.data);
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  // Function to verify OTP with backend
  const verifyOtpWithBackend = async (fieldKey, value, otp) => {
    try {

      const response = await axiosInstance.post('/auth/verify-otp', { type: fieldKey, email: value, mobileNo : value, otp, registrationNumber: businessData?.registrationNumber });
      console.log('Successfully verified OTP:', response.data);
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return error.message;
    }
  };

  const handleSendOtp = async (fieldKey) => {
    console.log("fieldKey", fieldKey);
    // Reset error state
    setVerificationStatus(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], error: null }
    }));

    // Get the field value from form
    const fieldValue = document.querySelector(`[name="${fieldKey}"]`)?.value;
    console.log("fieldValue", fieldValue);
    
    // Validate the input before sending OTP
    let isValid = true;
    let errorMessage = '';

    if (!fieldValue) {
      isValid = false;
      errorMessage = 'Please enter a valid value first';
    } else if (fieldKey.includes('Mobile') && !/^[0-9]{10}$/.test(fieldValue)) {
      isValid = false;
      errorMessage = 'Enter a valid 10-digit mobile number';
    } else if (fieldKey.includes('Email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
      isValid = false;
      errorMessage = 'Enter a valid email address';
    }

    if (!isValid) {
      setVerificationStatus(prev => ({
        ...prev,
        [fieldKey]: { 
          ...prev[fieldKey], 
          error: errorMessage
        }
      }));
      return;
    }

    // Show loading state
    setVerificationStatus(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], loading: true }
    }));

    // Send OTP to backend
    const otpSent = await sendOtpToBackend(fieldKey, fieldValue);

    console.log("otpSent", otpSent);

    setVerificationStatus(prev => ({
      ...prev,
      [fieldKey]: { 
        ...prev[fieldKey], 
        loading: false,
        error: otpSent ? null : 'Failed to send OTP'
      }
    }));

    if (otpSent || (fieldKey === "representativeMobile" || fieldKey === "businessMobile")) {
      setOtpState(prev => ({
        ...prev,
        [fieldKey]: {
          ...prev[fieldKey],
          show: true,
        }
      }));
    }
  };

  const handleVerifyOtp = async (fieldKey) => {
    const otpValue = otpState[fieldKey].otp.join('');
    const fieldValue = document.querySelector(`[name="${fieldKey}"]`)?.value;

    if (otpValue.length !== 6) {
      setVerificationStatus(prev => ({
        ...prev,
        [fieldKey]: { 
          ...prev[fieldKey], 
          error: 'Please enter a complete 6-digit OTP'
        }
      }));
      return;
    }

    setVerificationStatus(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], loading: true }
    }));

    // Verify OTP with backend
    const verificationResult = await verifyOtpWithBackend(fieldKey, fieldValue, otpValue);

    if (verificationResult === true) {
      setVerificationStatus(prev => ({
        ...prev,
        [fieldKey]: { 
          verified: true, 
          loading: false, 
          error: null 
        }
      }));
    } else {
      setVerificationStatus(prev => ({
        ...prev,
        [fieldKey]: { 
          ...prev[fieldKey], 
          loading: false,
          error: verificationResult || 'Invalid OTP'
        }
      }));
    }
  };

  const renderVerificationButton = (fieldKey) => {
    const status = verificationStatus[fieldKey];
    
    if (status.verified) {
      return (
        <div className="flex items-center text-green-600">
          <CheckBadgeIcon className="h-5 w-5 mr-1" />
          <span>Verified</span>
        </div>
      );
    }
    
    if (otpState[fieldKey].show) {
      return (
        <button
          type="button"
          onClick={() => handleVerifyOtp(fieldKey)}
          disabled={status.loading}
          className={`px-3 py-2 cursor-pointer ${
            status.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
          } text-white rounded-md`}
        >
          {status.loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      );
    }
    
    return (
      <button
        type="button"
        onClick={() => handleSendOtp(fieldKey)}
        disabled={status.loading}
        className={`px-3 py-2 cursor-pointer ${
          status.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
        } text-white rounded-md`}
      >
        {status.loading ? 'Sending...' : 'Send OTP'}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex w-full items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Company Registration Number (CRN)</label>
          <input
            type="text"
            {...register('registrationNumber', { required: 'CRN is required' })}
            className="mt-1 w-full px-3 py-2 border-none text-gray-600 cursor-not-allowed border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="L24200UP2023PLC012345"
            disabled={true}
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>
          )}
        </div>
      </div>
      
      {/* Representative Mobile */}
      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Representative Mobile Number
          </label>
          {verificationStatus.representativeMobile.verified && (
            <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
          )}
          {verificationStatus.representativeMobile.error && !verificationStatus.representativeMobile.verified && (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-2" />
          )}
        </div>
        <div className="flex space-x-2 items-center mt-1">
          <input
            name="representativeMobile"
            {...register('representativeMobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit mobile number',
              },
            })}
            placeholder="9876543210"
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${verificationStatus.representativeMobile.verified ? 'text-gray-600 cursor-not-allowed' : ''}`}
            disabled = {verificationStatus.representativeMobile.verified ? true : false}
          />
          {renderVerificationButton('representativeMobile')}
        </div>
        {errors.representativeMobile && (
          <p className="text-red-500 text-sm mt-1">{errors.representativeMobile.message}</p>
        )}
        {!errors.representativeMobile && otpState.representativeMobile.show && renderOtpInputs('representativeMobile')}
      </div>

      {/* Representative Email */}
      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Representative Email Address
          </label>
          {verificationStatus.representativeEmail.verified && (
            <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
          )}
          {verificationStatus.representativeEmail.error && !verificationStatus.representativeEmail.verified && (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-2" />
          )}
        </div>
        <div className="flex space-x-2 items-center mt-1">
          <input
            name="representativeEmail"
            {...register('representativeEmail', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            placeholder="example@mail.com"
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${verificationStatus.representativeEmail.verified ? 'text-gray-600 cursor-not-allowed' : ''}`}
            disabled = {verificationStatus.representativeEmail.verified ? true : false}
          />
          {renderVerificationButton('representativeEmail')}
        </div>
        {errors.representativeEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.representativeEmail.message}</p>
        )}
        {otpState.representativeEmail.show && renderOtpInputs('representativeEmail')}
      </div>

      {/* Business Mobile */}
      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Business Mobile Number
          </label>
          {verificationStatus.businessMobile.verified && (
            <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
          )}
          {verificationStatus.businessMobile.error && !verificationStatus.businessMobile.verified && (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-2" />
          )}
        </div>
        <div className="flex space-x-2 items-center mt-1">
          <input
            name="businessMobile"
            {...register('businessMobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit mobile number',
              },
            })}
            placeholder="9876543210"
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${verificationStatus.businessMobile.verified ? 'text-gray-600 cursor-not-allowed' : ''}`}
            disabled = {verificationStatus.businessMobile.verified ? true : false}
          />
          
          {renderVerificationButton('businessMobile')}
        </div>
        {verificationStatus.businessMobile.error && !verificationStatus.businessMobile.verified && (
            <span className="text-red-500">{verificationStatus.businessMobile.error}</span>
          )}
        {errors.businessMobile && (
          <p className="text-red-500 text-sm mt-1">{errors.businessMobile.message}</p>
        )}
        {otpState.businessMobile.show && renderOtpInputs('businessMobile')}
      </div>

      {/* Business Email */}
      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Business Email Address
          </label>
          {verificationStatus.businessEmail.verified && (
            <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
          )}
          {verificationStatus.businessEmail.error && !verificationStatus.businessEmail.verified && (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 ml-2" />
          )}
        </div>
        <div className="flex space-x-2 items-center mt-1">
          <input
            name="businessEmail"
            {...register('businessEmail', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            placeholder="example@mail.com"
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${verificationStatus.businessEmail.verified ? 'text-gray-600 cursor-not-allowed' : ''}`}  
            disabled = {verificationStatus.businessEmail.verified ? true : false} 
          />
          {renderVerificationButton('businessEmail')}
        </div>
        {errors.businessEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.businessEmail.message}</p>
        )}
        {otpState.businessEmail.show && renderOtpInputs('businessEmail')}
      </div>
    </form>
  );
});

export default Verification;