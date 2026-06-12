import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { PlusCircle, Search, Briefcase, ArrowLeft } from "lucide-react";
import Footer from "../components_lite/Footer";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="hero-gradient border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] font-bold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <Briefcase className="text-[#6A38C2]" /> Managed Job Postings
              </h1>
              <p className="text-slate-500 mt-1">Review and manage all your active and closed job opportunities.</p>
            </div>
            <Button 
              onClick={() => navigate("/admin/jobs/create")}
              className="btn-brand py-6 px-8 rounded-2xl shadow-lg"
            >
              <PlusCircle size={20} className="mr-2" /> Post New Opportunity
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input-field pl-12 py-3"
                placeholder="Search by role or company..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-8">
            <AdminJobsTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminJobs;
