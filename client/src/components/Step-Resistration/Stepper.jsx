import React, { useEffect, useRef, useState } from 'react'

const Stepper = ({ steps, currStep }) => {
  const [newStep, setNewStep] = useState([]);
  const stepRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = [...steps];
    let count = 0;

    while (count < newSteps.length) {
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          completed: true,
          highlighted: true,
          selected: true
        };
      } else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          completed: true,
          highlighted: false,
          selected: true
        };
      } else {
        newSteps[count] = {
          ...newSteps[count],
          completed: false,
          highlighted: false,
          selected: false
        };
      }
      count++;
    }

    return newSteps;
  };

  useEffect(() => {
    const stepState = steps.map((step, index) =>
      Object.assign({}, {
        description: step,
        completed: false,
        highlighted: index === 0,
        selected: index === 0
      })
    );

    stepRef.current = stepState;
    const curr = updateStep(currStep - 1, stepRef.current);
    setNewStep(curr);
  }, [currStep]);

  const displaySteps = newStep.map((step, index) => {
    return (
      <div
        key={index}
        className={index !== newStep.length - 1 ? 'w-full flex items-center' : 'flex'}
      >
        <div className="relative flex flex-col items-center text-teal-600">
          <div
            className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3 ${step.selected ? 'bg-teal-400 text-white' : 'bg-white text-teal-600'}`}
          >
            {step.completed ? (
              <span className="text-white font-bold text-xl">&#10003;</span>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <div className={`mt-2 w-32 text-center text-xs font-medium uppercase ${step.highlighted ? 'text-teal-600' : 'text-gray-500'}`}>
            {step.description}
          </div>
        </div>
        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed ? 'border-teal-400' : 'border-gray-400'}`}
        ></div>
      </div>
    );
  });

  return <div className="mx-4 p-4 flex justify-between items-center">{displaySteps}</div>;
};

export default Stepper;
