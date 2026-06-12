import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Filtercard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, Frown, Sparkles } from "lucide-react";
import Footer from "./Footer";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      if (searchedQuery.startsWith("__COMPLEX__")) {
        try {
          const filterObj = JSON.parse(searchedQuery.replace("__COMPLEX__", ""));
          const filtered = allJobs.filter((job) => {
            const matchesLocation = !filterObj.Location || 
              job.location.toLowerCase().includes(filterObj.Location.toLowerCase());
            
            const matchesRole = !filterObj.Role || 
              job.title.toLowerCase().includes(filterObj.Role.toLowerCase()) || 
              (job.category && job.category.toLowerCase().includes(filterObj.Role.toLowerCase()));
            
            const matchesSalary = !filterObj["Salary (LPA)"] || 
              checkSalaryRange(job.salary, filterObj["Salary (LPA)"]);

            return matchesLocation && matchesRole && matchesSalary;
          });
          setFilterJobs(filtered);
        } catch (e) {
          console.error("Filter parse error", e);
          setFilterJobs(allJobs);
        }
      } else {
        const query = searchedQuery.toLowerCase();
        const filtered = allJobs.filter((job) => {
          return (
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query) ||
            (job.category && job.category.toLowerCase().includes(query))
          );
        });
        setFilterJobs(filtered);
      }
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  const checkSalaryRange = (salary, range) => {
    if (range === "25+") return salary >= 25;
    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="hero-gradient border-b border-slate-100 py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[#6A38C2] font-bold text-sm uppercase tracking-widest mb-2">
            <Briefcase size={16} /> Job Marketplace
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Find Your <span className="text-[#6A38C2]">Perfect Match</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Showing {filterJobs.length} {filterJobs.length === 1 ? "job" : "jobs"} based on your preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <Filtercard />
          </div>

          {/* Job List */}
          <div className="flex-1">
            {filterJobs.length <= 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No jobs found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filterJobs.map((job) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={job?._id}
                    >
                      <Job1 job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
