// src/components/Fund/Stepper.jsx

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

// Props:
//   steps:    array of step‐titles, e.g. ["Select Fund Type", "Proposal Data", …]
//   currStep: zero-based index of the current step
//   isOpen:   boolean → whether the sidebar is expanded (show labels) or collapsed
//
const Stepper = ({ steps, currStep, isOpen }) => {
  const [stepState, setStepState] = useState([]);

  // Build a state array of { description, completed, highlighted, selected }
  // whenever steps or currStep changes
  useEffect(() => {
    const newState = steps.map((desc, idx) => ({
      description: desc,
      completed: idx < currStep,       // all indices < currStep are “done”
      highlighted: idx === currStep,    // exactly currStep is highlighted
      selected: idx === currStep,       // exactly currStep is selected
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
                          ${
                            step.completed
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

            {/* Label (only if sidebar is open) */}
            {isOpen && (
              <span
                className={`ml-3 text-sm font-medium 
                            ${
                              step.highlighted
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

          {/* Connector line (except after last step) */}
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
