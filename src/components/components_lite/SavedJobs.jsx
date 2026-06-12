import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { Bookmark, Briefcase, Search, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_ENDPOINT}/saved-jobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // Fixed: Backend returns 'savedJobs', not 'jobs'
          setSavedJobs(res.data.savedJobs || []);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="hero-gradient border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4">
                <div className="p-3 bg-[#6A38C2] rounded-2xl text-white shadow-lg shadow-[#6A38C2]/20">
                  <Bookmark size={28} fill="currentColor" />
                </div>
                Your Bookmarked Jobs
              </h1>
              <p className="text-slate-500 mt-3 text-lg">
                Manage all the opportunities you've saved for later.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white/50 flex items-center gap-6">
              <div className="text-center px-4">
                <p className="text-2xl font-black text-[#6A38C2]">{savedJobs.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Saved</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center px-4">
                <p className="text-2xl font-black text-orange-500">
                  {savedJobs.filter(j => j.isActive).length}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[400px] bg-white rounded-[32px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Job1 job={job} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm px-8">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search size={40} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4">No saved jobs yet</h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Start exploring thousands of opportunities and bookmark the ones that match your career goals. 
              We'll keep them here for you to review and apply later.
            </p>
            <Button 
              onClick={() => navigate("/Jobs")}
              className="btn-brand py-7 px-10 rounded-2xl text-lg group shadow-xl shadow-[#6A38C2]/20"
            >
              Explore Jobs <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SavedJobs;
