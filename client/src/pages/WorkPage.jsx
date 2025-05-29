import React, { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa"; // this is for the react-icons you all need to do npm install react-icons 
import data from "../assets/data.json";
import Card from '../components/Card';

const allCategories = [
  "Ayurveda", "Homeopathy", "Yoga & Naturopathy",
  "Siddha", "Unani", "Sowa Rigpa"
];

export default function WorkPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const regex = new RegExp(locationInput, 'i');
    const result = data.filter(company => {
      const locationMatch = regex.test(company.location);
      const categoryMatch =
        selectedCategories.length === 0 ||
        company.categories.some(c => selectedCategories.includes(c));
      return locationMatch && categoryMatch;
    });

    setFilteredData(result);
  }, [locationInput, selectedCategories]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-5 right-5 z-10 flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition"
      >
        <FaFilter />
        <span>Filter</span>
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        AYUSH Companies
      </h1>

      {/* Filter */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          {/* Heres the location filter */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g., Delhi|Lucknow"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Filter by Categories:</label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    selectedCategories.includes(category)
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-indigo-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    {/* Data is displayed here */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No companies match the filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((company, index) => (
            <Card key={index} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
