import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";
import { Building2, ArrowLeft, PlusCircle, Globe, ShieldCheck, Loader2, GraduationCap, Building } from "lucide-react";
import Footer from "../components_lite/Footer";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [orgType, setOrgType] = useState("Corporate");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    if (!registrationNumber.trim()) {
      toast.error("Please enter your registration number");
      return;
    }

    try {
      setVerifying(true);
      const res = await axios.post(
        `${COMPANY_API_ENDPOINT}/register`,
        { companyName, orgType, registrationNumber },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res.data.company._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register company");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-20">
        <div className="w-full max-w-xl">
          <button 
            onClick={() => navigate("/admin/companies")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] font-bold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Companies
          </button>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] p-10 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <Building2 size={40} />
              </div>
              <h1 className="text-3xl font-black mb-2">Register Your Company</h1>
              <p className="text-purple-100">Let's start by setting up your organization profile.</p>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700">Organization Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrgType("Corporate")}
                    className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all font-bold ${
                      orgType === "Corporate" 
                        ? "border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]" 
                        : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <Building size={18} /> Corporate
                  </button>
                  <button
                    onClick={() => setOrgType("Educational Institute")}
                    className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all font-bold ${
                      orgType === "Educational Institute" 
                        ? "border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]" 
                        : "border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <GraduationCap size={18} /> Education
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700">What would you like to name your organization?</Label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    className="input-field pl-12 py-4 text-lg"
                    placeholder={orgType === "Corporate" ? "e.g. Microsoft, Google, TechCorp" : "e.g. Stanford University"}
                    onChange={(e) => setCompanyName(e.target.value)}
                    value={companyName}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 flex justify-between items-center">
                  <span>{orgType === "Corporate" ? "Udyam Registration Number" : "AICTE / UGC Number"}</span>
                  <ShieldCheck size={16} className="text-green-500" />
                </Label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-field py-4 text-lg font-mono uppercase"
                    placeholder={orgType === "Corporate" ? "UDYAM-MH-00-0000000" : "AICTE-123456"}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    value={registrationNumber}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-amber-50 text-amber-600 p-2 rounded-lg inline-block">
                  {orgType === "Corporate" ? "⚠️ Verified against Government MSME Database" : "⚠️ Subject to manual verification"}
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  onClick={registerNewCompany}
                  disabled={verifying}
                  className="w-full btn-brand py-8 rounded-2xl text-lg relative overflow-hidden group"
                >
                  {verifying ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Verifying with Government Database...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={20} /> Verify & Create Profile
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin/companies")}
                  className="w-full py-8 rounded-2xl border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck size={14} className="text-green-500" /> Secure & Private for Recruiters
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyCreate;
