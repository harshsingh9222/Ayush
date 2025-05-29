import React from 'react';

const Card = ({ company }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-xl font-bold text-indigo-600">{company.companyName}</h2>
      <p className="text-gray-500 text-sm mt-1">{company.location}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {company.categories.map((category, index) => (
          <span
            key={index}
            className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full"
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
