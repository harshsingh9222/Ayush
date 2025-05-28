import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './Complete.css';

const Completed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center animate-bubble-out text-steel">
      <CheckCircle2 className="w-16 h-16 text-teal-400 mb-4 animate-pulse-inout transition ease-in-out" />
      <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
      <p className="text-lg text-gray-600" >Your information has been successfully submitted.</p>
    </div>
  );
};

export default Completed;
