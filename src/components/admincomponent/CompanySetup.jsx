import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Building2, Globe, MapPin, Info, Users, Calendar, Camera } from "lucide-react";
import { Label } from "../ui/label";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "@/utils/data";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import Footer from "../components_lite/Footer";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    size: "",
    founded: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("industry", input.industry);
    formData.append("size", input.size);
    formData.append("founded", input.founded);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      industry: singleCompany.industry || "",
      size: singleCompany.size || "",
      founded: singleCompany.founded || "",
      file: singleCompany.logo || null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="hero-gradient border-b border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate("/admin/companies")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] font-bold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              {singleCompany.logo ? (
                <img src={singleCompany.logo} alt="Logo" className="w-14 h-14 object-contain" />
              ) : (
                <Building2 size={40} className="text-[#6A38C2]/20" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{input.name || "Company Profile"}</h1>
              <p className="text-slate-500">Complete your organization's details to attract the best talent.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <form onSubmit={submitHandler} className="p-8 md:p-12 space-y-12">
            
            {/* Basic Info */}
            <div className="space-y-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Info size={20} className="text-[#6A38C2]" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Company Name</Label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={changeEventHandler}
                      className="input-field pl-10"
                      placeholder="e.g. TechCorp India"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Industry</Label>
                  <input
                    type="text"
                    name="industry"
                    value={input.industry}
                    onChange={changeEventHandler}
                    className="input-field"
                    placeholder="e.g. IT, FinTech, E-commerce"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">About the Company</Label>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Tell us about your company's mission and culture..."
                />
              </div>
            </div>

            {/* Online Presence */}
            <div className="space-y-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Globe size={20} className="text-blue-500" /> Online & Presence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Website URL</Label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="website"
                      value={input.website}
                      onChange={changeEventHandler}
                      className="input-field pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Headquarters Location</Label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={input.location}
                      onChange={changeEventHandler}
                      className="input-field pl-10"
                      placeholder="e.g. Bangalore, India"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Stats */}
            <div className="space-y-8">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Users size={20} className="text-green-600" /> Organization Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Company Size</Label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      name="size" 
                      value={input.size} 
                      onChange={changeEventHandler}
                      className="input-field pl-10 appearance-none"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Founded Year</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="founded"
                      value={input.founded}
                      onChange={changeEventHandler}
                      className="input-field pl-10"
                      placeholder="e.g. 2015"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-slate-500 uppercase">Company Logo</Label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#6A38C2] transition-colors group cursor-pointer relative">
                  <Camera size={24} className="text-slate-400 group-hover:text-[#6A38C2]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">Click to upload logo</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">JPG, PNG or WebP (Max 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 btn-brand py-8 rounded-2xl text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating Profile...
                  </>
                ) : (
                  "Update Company Details"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanySetup;
