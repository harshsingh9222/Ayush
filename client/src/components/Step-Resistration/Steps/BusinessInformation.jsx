import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const BusinessDetails = forwardRef(({ onSubmit }, ref) => {
  const buisnessStatus = useSelector((state) => state.business?.status);
  const buisnessData = useSelector((state) => state.business?.businessData);

  console.log("Business Status:", buisnessStatus);
  console.log("Business Data:", buisnessData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useImperativeHandle(ref, () => ({
      submitForm: () => {
        handleSubmit(onSubmit)();
      }
  }));
   useEffect(() => {
    if (buisnessData) {
      reset({
        businessName: buisnessData.businessName || '',
        registrationNumber: buisnessData.registrationNumber || '',
        registrationDate: buisnessData.registrationDate.split("T")[0] || '',
        sectors: buisnessData.sectors || [],
        addressLine1: buisnessData.addressLine1 || '',
        addressLine2: buisnessData.addressLine2 || '',
        villageTown: buisnessData.villageTown || '',
        tehsil: buisnessData.tehsil || '',
        post: buisnessData.post || '',
        postalCode: buisnessData.postalCode || '',
        state: buisnessData.state || '',
        district: buisnessData.district || '',
        bankName: buisnessData.bankName || '',
        ifscCode: buisnessData.ifscCode || '',
        accountHolderName: buisnessData.accountHolderName || '',
        bankAccountNumber: buisnessData.bankAccountNumber || '',
        businessObjectives: buisnessData.objectivesOfbusiness || ''
      });

      console.log(buisnessData);
    }
  }, [buisnessData, reset]);

  const [proofFile, setProofFile] = useState(null);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Business Name and Registration Date */}
      <div className="flex space-x-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            {...register('businessName', { required: 'Business name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Registered Business Name"
          />
          {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
        </div>
      </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Company Registration Number(CRN)</label>
            <input
              type="string"
              {...register('registrationNumber', { required: 'CRN is required' })}
              className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${buisnessData?.registrationNumber ? 'text-gray-600 cursor-not-allowed' : ''}`}
              placeholder="L24200UP2023PLC012345"
              disabled = {buisnessData?.registrationNumber ? true : false}
            />
            {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
        </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Registration Date</label>
            <input
              type="date"
              {...register('registrationDate', { required: 'Registration date is required' })}
              className="mt-1 w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            />
            {errors.registrationDate && <p className="text-red-500 text-sm mt-1">{errors.registrationDate.message}</p>}
          </div>
        </div>

      {/* Sector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
        <div className="grid grid-cols-2 gap-2">
          {['Ayurveda', 'Yoga', 'Unani', 'Siddha', 'Homeopathy', 'Naturopathy'].map((sector) => (
            <div key={sector} className="flex items-center">
              <input
                type="checkbox"
                id={`sector-${sector}`}
                value={sector}
                {...register('sectors', { 
                  required: 'At least one sector is required',
                  validate: (value) => value.length > 0 || 'At least one sector is required'
                })}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label htmlFor={`sector-${sector}`} className="ml-2 block text-sm text-gray-700">
                {sector}
              </label>
            </div>
          ))}
        </div>
        {errors.sectors && <p className="text-red-500 text-sm mt-1">{errors.sectors.message}</p>}
      </div>

      {/* Business Address */}

      <label className="block text-md font-medium text-gray-700 mb-1">{'*Business Address'}</label>
      <div className="flex mt-3 space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input
            {...register('addressLine1', { required: 'Address Line 1 is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Street, Building No."
          />
          {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
          <input
            {...register('addressLine2')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Apartment, Area"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Village / Town</label>
          <input
            {...register('villageTown')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Village or Town"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Tehsil</label>
          <input
            {...register('tehsil')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Tehsil"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Post</label>
          <input
            {...register('post')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Post Office"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            {...register('postalCode', {
              required: 'Postal code is required',
              pattern: { value: /^\d{6}$/, message: 'Enter a valid 6-digit postal code' },
            })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="560001"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            {...register('state', { required: 'State is required' })}
            className="mt-1 w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Select State</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">District</label>
          <select
            {...register('district', { required: 'District is required' })}
            className="mt-1 mb-4 w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Select District</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="New Delhi">New Delhi</option>
          </select>
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
        </div>
      </div>

      {/* Bank Account Details */}
      <label className="block text-md font-medium text-gray-700 mb-3">{'*Bank Account Details'}</label>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            {...register('bankName', { required: 'Account name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="State Bank of India"
          />
          {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
          <input
            {...register('ifscCode', { required: 'IFSC code is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="SBIN0000001"
          />
          {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode.message}</p>}
        </div>
      </div> 
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
          <input
            {...register('accountHolderName', { required: 'Account Holder Name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Ayush Wellness Pvt Ltd"
          />
          {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
          <input
            {...register('bankAccountNumber', { required: 'Account Number is required' })}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${buisnessData?.bankAccountNumber ? 'text-gray-600 cursor-not-allowed' : ''}`}
            placeholder="Business Account Number"
            disabled= {buisnessData?.bankAccountNumber ? true : false}
          />
          {errors.bankAccountNumber && <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber.message}</p>}
        </div>
      </div> 

        {/* Define Your Business Objectives, Goals & Expansion Plans */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Define Your Business Objectives, Goals & Expansion Plans
        </label>
        <textarea
            {...register('businessObjectives', {
            required: 'This field is required',
            minLength: {
                value: 150,
                message: 'Please enter at least 150 words'
            },
            maxLength: {
                value: 300,
                message: 'Please limit your response to 300 words'
            }
            })}
            rows={6}
            placeholder="Share your short and long-term business goals, expansion areas, and vision."
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
        {errors.businessObjectives && (
            <p className="text-red-500 text-sm mt-1">{errors.businessObjectives.message}</p>
        )}
      </div>

    </form>
  );
});

export default BusinessDetails;
