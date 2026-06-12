import React, { useState } from "react";
import { Search, Briefcase, MapPin, Users, Building } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/Browse"); // Fixed navigation case sensitivity
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchJobHandler();
  };

  return (
    <div className="hero-gradient relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-[#6A38C2] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#6A38C2] animate-pulse" />
            No. 1 Job Portal in India
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Search, Apply & <br />
            <span className="gradient-text">Get Your Dream Job</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-lg md:text-xl mb-12">
            Connecting talented professionals with India's most innovative companies. 
            Start your journey today with over <span className="font-bold text-[#6A38C2]">10,000+</span> opportunities.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-[24px] shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2 md:gap-4 group focus-within:ring-4 focus-within:ring-[#6A38C2]/5 transition-all">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <Search size={22} className="text-slate-400 group-focus-within:text-[#6A38C2] transition-colors" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full bg-transparent border-none outline-none text-slate-800 text-base md:text-lg font-medium placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={searchJobHandler}
                className="w-full md:w-auto px-8 py-6 rounded-xl md:rounded-2xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #6A38C2, #8B5CF6)" }}
              >
                Search Jobs
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-2 text-slate-500">
                <Building size={18} className="text-[#6A38C2]" />
                <span className="text-sm font-bold text-slate-700">5k+ Companies</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Briefcase size={18} className="text-[#F83002]" />
                <span className="text-sm font-bold text-slate-700">10k+ Jobs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={18} className="text-blue-500" />
                <span className="text-sm font-bold text-slate-700">1M+ Candidates</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
