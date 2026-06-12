import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const filterData = [
  {
    filterType: "Location",
    array: ["Bangalore", "Pune", "Mumbai", "Hyderabad", "Delhi", "Chennai", "Remote"],
  },
  {
    filterType: "Role",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Data Scientist",
      "UI/UX Designer",
      "Product Manager",
    ],
  },
  {
    filterType: "Salary (LPA)",
    array: ["0-3", "3-6", "6-12", "12-25", "25+"],
  },
];

const Filtercard = () => {
  const [filters, setFilters] = useState({
    Location: "",
    Role: "",
    "Salary (LPA)": ""
  });
  const dispatch = useDispatch();

  const changeHandler = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
  };

  useEffect(() => {
    // Check if any filter is active
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    
    if (Object.keys(activeFilters).length > 0) {
      // Send as a special formatted string that Jobs.jsx can parse
      dispatch(setSearchedQuery(`__COMPLEX__${JSON.stringify(activeFilters)}`));
    } else {
      dispatch(setSearchedQuery(""));
    }
  }, [filters, dispatch]);

  const clearFilters = () => {
    setFilters({
      Location: "",
      Role: "",
      "Salary (LPA)": ""
    });
    dispatch(setSearchedQuery(""));
  };

  const isAnyFilterActive = Object.values(filters).some(v => v !== "");

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#6A38C2]" />
          Filters
        </h2>
        {isAnyFilterActive && (
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-[#F83002] hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      <div className="space-y-8">
        {filterData.map((data, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              {data.filterType}
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${filters[data.filterType] ? "rotate-180 text-[#6A38C2]" : ""}`} />
            </h3>
            <RadioGroup 
              value={filters[data.filterType]} 
              onValueChange={(value) => changeHandler(data.filterType, value)}
            >
              <div className="space-y-2 ml-1">
                {data.array.map((item, idx) => {
                  const itemId = `id${index}-${idx}`;
                  return (
                    <div key={itemId} className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem 
                        value={item} 
                        id={itemId} 
                        className="border-slate-300 text-[#6A38C2] focus:ring-[#6A38C2]"
                      />
                      <Label 
                        htmlFor={itemId} 
                        className={`text-sm cursor-pointer transition-colors ${
                          filters[data.filterType] === item ? "text-[#6A38C2] font-bold" : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {item}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
            {index !== filterData.length - 1 && <div className="h-px bg-slate-50 mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filtercard;
