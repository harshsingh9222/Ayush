import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const Stepper = ({ steps, currStep, isOpen }) => {
  const [stepState, setStepState] = useState([]);

  useEffect(() => {
    const newState = steps.map((desc, idx) => ({
      description: desc,
      completed: idx < currStep,
      highlighted: idx === currStep,
      selected: idx === currStep,
    }));
    setStepState(newState);
  }, [steps, currStep]);

  return (
    <div
      className={`flex flex-col items-center
                  ${isOpen ? "w-48 p-4" : "w-12 p-2"}
                  bg-white rounded-xl shadow-md`}
    >
      {stepState.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex items-center w-full">
            {/* Circle */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${step.completed
                  ? "bg-teal-500"
                  : step.selected
                    ? "bg-indigo-600"
                    : "bg-gray-300"
                }`}
            >
              {step.completed ? (
                <CheckCircle className="text-white" size={16} />
              ) : (
                <span className="text-white text-sm">{idx + 1}</span>
              )}
            </div>

            {isOpen && (
              <span
                className={`ml-3 text-sm font-medium 
                            ${step.highlighted
                    ? "text-indigo-600"
                    : step.completed
                      ? "text-teal-600"
                      : "text-gray-500"
                  }`}
              >
                {step.description}
              </span>
            )}
          </div>

          {idx < steps.length - 1 && (
            <div
              className={`w-px ${step.completed ? "bg-teal-400" : "bg-gray-300"} h-8 my-2`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
