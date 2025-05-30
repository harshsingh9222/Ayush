import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useSelector } from 'react-redux';

const CompanyDocumentsUpload = forwardRef(({ onSubmit }, ref) => {
  const businessData = useSelector((state) => state.business.businessData);
  console.log('Business Data:', businessData);

  const existingFiles = {
    businessProofFile: businessData?.businessProof,
    ownershipProofFile: businessData?.ownershipProof,
    moaFile: businessData?.moa,
    aoaFile: businessData?.aoa,
    bankStatementFile: businessData?.bankStatement,
    bankPassbookFile: businessData?.bankPassbook,
    partnershipDeedFile: businessData?.partnershipDeed,
    businessContinuityProofFile: businessData?.businessContinuityProof,
  };

  console.log('Existing Files:', existingFiles);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (businessData) {
      reset({
        registrationNumber: businessData?.registrationNumber || '',
      });
    }
  }, [businessData, reset]);

useImperativeHandle(ref, () => ({
  submitForm: () => {
    handleSubmit((formData) => {
      const finalData = { ...formData };
      const requiredFiles = [
        'businessProofFile', 'ownershipProofFile', 'moaFile',
        'aoaFile', 'bankStatementFile', 'bankPassbookFile',
        'partnershipDeedFile', 'businessContinuityProofFile'
      ];

      const missingFiles = [];

      for (const key of requiredFiles) {
        const fileList = formData[key];
        const newFile = fileList?.[0];

        if (newFile instanceof File) {
          finalData[key] = createFakeFileList(newFile);
        } 
        else if (existingFiles[key]) {
          finalData[key] = existingFiles[key];
        } else {
          missingFiles.push(key);
        }
      }

      if (missingFiles.length > 0) {
        missingFiles.forEach(field => {
          setError(field, { type: 'manual', message: 'This file is required' });
        });
        return;
      }

      console.log('Final Data to Submit:', finalData);
      onSubmit(finalData);
    })();
  }
}));

  function createFakeFileList(file) {
    const fileList = {
      0: file,
      length: 1,
      item: index => index === 0 ? file : null,
      [Symbol.iterator]: function* () {
        yield file;
      },
    };
    return fileList;
  }


  const renderUploadField = (label, fieldName) => {
    const file = watch(fieldName)?.[0];
    return (
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <label
          htmlFor={fieldName}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gray-500 rounded-md cursor-pointer hover:bg-gray-600"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload PDF
        </label>
        <input
          id={fieldName}
          type="file"
          accept="application/pdf"
          {...register(fieldName)}
          className="hidden"
        />

        {file && (
          <span className="text-sm text-gray-700 block mt-1 truncate max-w-xs">
            {file.name}
          </span>
        )}

        {!file && existingFiles[fieldName] && (
          <span className="text-sm text-gray-700 block mt-1 truncate max-w-xs">
            {existingFiles[fieldName]}
          </span>
        )}

        <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted</p>
        {errors[fieldName] && (
          <p className="text-red-500 text-sm mt-1">{errors[fieldName].message}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex w-full items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Company Registration Number (CRN)</label>
          <input
            type="text"
            {...register('registrationNumber', { required: 'CRN is required' })}
            className="mt-1 w-full px-3 py-2 border  text-gray-600 cursor-not-allowed border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            placeholder="L24200UP2023PLC012345"
            disabled = {true}
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-4">
        {renderUploadField('Certificate of Incorporation', 'businessProofFile')}
        {renderUploadField('Ownership Proof', 'ownershipProofFile')}
      </div>
      <div className="flex space-x-4">
        {renderUploadField('Memorandum of Association (MoA)', 'moaFile')}
        {renderUploadField('Articles of Association (AoA)', 'aoaFile')}
      </div>
      <div className="flex space-x-4">
        {renderUploadField('Last 6 months Bank Statement', 'bankStatementFile')}
        {renderUploadField('Bank Passbook', 'bankPassbookFile')}
      </div>
      <div className="flex space-x-4">
        {renderUploadField('Partnership Deed (if applicable)', 'partnershipDeedFile')}
        {renderUploadField('Business Continuity Proof', 'businessContinuityProofFile')}
      </div>
    </form>
  );
});

export default CompanyDocumentsUpload;