import React,{ forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useSelector } from 'react-redux';

const Account = forwardRef(({ onSubmit }, ref) => {

  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [addressProofFile, setAddressProofFile] = useState(null);
  
  const representativeData = useSelector((state) => state.representative.representativeData);
  console.log("Representative Data:", representativeData);

    const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      firstName: representativeData?.name?.split(" ")[0] || "",
      lastName: representativeData?.name?.split(" ")[1] || "",
      dob: representativeData?.dob?.split("T")[0] || "",
      position: representativeData?.position || "",
      aadharNumber: representativeData?.aadharNo || "",
      panNumber: representativeData?.panNo || "",
      addressLine1: representativeData?.addressLine1 || "",
      addressLine2: representativeData?.addressLine2 || "",
      villageTown: representativeData?.village || "",
      tehsil: representativeData?.tehsil || "",
      post: representativeData?.post || "",
      postalCode: representativeData?.postalCode || "",
      state: representativeData?.state || "",
      district: representativeData?.district || "",
      addressProofName: representativeData?.addressProofName || "",
    }
  });
  
  useEffect(() => {
    if (representativeData) {
      reset({
        firstName: representativeData?.name?.split(" ")[0] || "",
        lastName: representativeData?.name?.split(" ")[1] || "",
        dob: representativeData?.dob?.split("T")[0] || "",
        position: representativeData?.position || "",
        aadharNumber: representativeData?.aadharNo || "",
        panNumber: representativeData?.panNo || "",
        addressLine1: representativeData?.addressLine1 || "",
        addressLine2: representativeData?.addressLine2 || "",
        villageTown: representativeData?.village || "",
        tehsil: representativeData?.tehsil || "",
        post: representativeData?.post || "",
        postalCode: representativeData?.postalCode || "",
        state: representativeData?.state || "",
        district: representativeData?.district || "",
        addressProofName: representativeData?.addressProofName || "",
      });

      setAadharFile(representativeData?.aadharPic || "null");
      setPanFile(representativeData?.panPic || null);
      setAddressProofFile(representativeData?.addressProofPic || null);
    }
  }, [representativeData, reset]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmit)();
    }
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Existing fields omitted for brevity */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          {...register('dob', { required: 'Date of birth is required' })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
        />
        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
      </div>

      {/* Position in Business */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Position in Business</label>
        <input
          {...register('position', { required: 'Position is required' })}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          placeholder="Manager / Owner"
        />
        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
      </div>

      {/* Aadhar Number and Upload */}
      <div className="flex space-x-4 items-center">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
          <input
            {...register('aadharNumber', {
              required: 'Aadhar number is required',
              pattern: { value: /^\d{12}$/, message: 'Enter a valid 12-digit Aadhar number' },
            })}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${representativeData?.aadharNo ? 'text-gray-600 cursor-not-allowed' : ''}`}
            placeholder="123456789012"
            disabled = {representativeData?.aadharNo ? true : false}
          />
          {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber.message}</p>}
        </div>
      </div>

      {/* PAN Card Number and Upload */}
      <div className="flex space-x-4 items-center">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
          <input
            {...register('panNumber', {
              required: 'PAN number is required',
              pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Enter a valid PAN number' },
            })}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${representativeData?.panNo ? 'text-gray-600 cursor-not-allowed' : ''}`}
            placeholder="ABCDE1234F"
            disabled = {representativeData?.panNo ? true : false}
          />
          {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber.message}</p>}
        </div>

      </div>

      {/* Address Section */}
      <div className="flex space-x-4">
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
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


      <div className="flex space-x-4 items-center">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Address Proof Name</label>
          <input
            {...register('addressProofName', { required: 'Proof name is required' })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="Electricity Bill / Rental Agreement"
          />
          {errors.addressProofName && <p className="text-red-500 text-sm mt-1">{errors.addressProofName.message}</p>}
        </div>

      </div>
    </form>
  );
});

export default Account;
