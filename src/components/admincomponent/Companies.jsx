import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import CompaniesTable from "./CompaniesTable";
import useGetAllCompanies from "@/hooks/usegetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { PlusCircle, Building2, Search, ArrowLeft } from "lucide-react";
import Footer from "../components_lite/Footer";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
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
                <Building2 className="text-[#6A38C2]" /> Registered Companies
              </h1>
              <p className="text-slate-500 mt-1">Manage your organization profiles and recruitment identities.</p>
            </div>
            <Button 
              onClick={() => navigate("/admin/companies/create")}
              className="btn-brand py-6 px-8 rounded-2xl shadow-lg"
            >
              <PlusCircle size={20} className="mr-2" /> Register New Company
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
                placeholder="Filter companies by name..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-8">
            <CompaniesTable />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Companies;
