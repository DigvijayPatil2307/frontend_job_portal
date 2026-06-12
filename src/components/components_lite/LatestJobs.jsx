import React from "react";
import LatestJobCard from "./LatestJobCard";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#6A38C2] font-bold text-sm uppercase tracking-widest mb-3">
              <Sparkles size={16} /> Featured Opportunities
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              Latest & <span className="text-[#6A38C2]">Top Job Openings</span>
            </h2>
          </div>
          <Link 
            to="/Jobs" 
            className="group flex items-center gap-2 text-slate-600 hover:text-[#6A38C2] font-bold transition-all"
          >
            View All Jobs 
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {allJobs.length <= 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No jobs available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allJobs.slice(0, 6).map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <LatestJobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
