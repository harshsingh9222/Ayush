import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const StepperControl = ({ handleClick, currStep, steps }) => {
  return (
    <div className="container flex justify-around mt-4 mb-8 items-center">
      
      {/* Previous Button */}
      <button
        onClick={() => handleClick("Previous")}
        disabled={currStep === 0}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md 
          ${currStep === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100 cursor-pointer"} 
          border-4 ${currStep === 0 ? "border-gray-300" : "border-teal-500"} 
          transition duration-200`}
      >
        <ArrowLeftIcon className={`h-6 w-6 ${currStep === 0 ? "text-gray-400" : "text-teal-600"}`} />
      </button>

      {/* Submit / Confirm Button */}
      <button
        onClick={() => handleClick("Submit")}
        className={`bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 
        font-semibold border-2 border-teal-500 hover:border-teal-600 
        transition duration-200 ease-in-out 
        ${currStep === steps.length ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {currStep >= steps.length - 1 ? "Submit" : "Save"}
      </button>

      {/* Next Button */}
      <button
        onClick={() => handleClick("Next")}
        disabled={currStep === steps.length}
        className={`w-14 h-14 rounded-full  flex items-center justify-center shadow-md 
          ${currStep === steps.length ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100 cursor-pointer"} 
          border-4 ${currStep === steps.length ? "border-gray-300" : "border-teal-500"} 
          transition duration-200`}
      >
        <ArrowRightIcon className={`h-6 w-6 ${currStep === steps.length ? "text-gray-400" : "text-teal-600"}`} />
      </button>

    </div>
  );
};

export default StepperControl;
