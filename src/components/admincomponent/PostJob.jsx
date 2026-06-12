import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT, AI_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  PlusCircle, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Target, 
  Layers, 
  Calendar,
  Building2,
  Sparkles
} from "lucide-react";
import Footer from "../components_lite/Footer";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    salaryType: "LPA",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
    category: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const generateDescriptionHandler = async () => {
    if (!input.title) {
      toast.error("Please enter a Job Title first to generate description.");
      return;
    }
    try {
      setIsGenerating(true);
      const res = await axios.post(`${AI_API_ENDPOINT}/generate-job-description`, {
        title: input.title,
        category: input.category,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      if (res.data.success) {
        setInput({ ...input, description: res.data.description });
        toast.success("Description generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="hero-gradient border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mb-6">
            <PlusCircle size={32} className="text-[#6A38C2]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Post a New Opportunity</h1>
          <p className="text-slate-500 mt-2">Reach thousands of qualified candidates in India.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12">
          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-[#6A38C2]" /> Job Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Job Title</Label>
                  <input
                    type="text"
                    name="title"
                    value={input.title}
                    onChange={changeEventHandler}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Category</Label>
                  <input
                    type="text"
                    name="category"
                    value={input.category}
                    onChange={changeEventHandler}
                    placeholder="e.g. IT, Design, Marketing"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={generateDescriptionHandler}
                    disabled={isGenerating}
                    className="h-8 text-xs font-bold text-[#6A38C2] hover:bg-[#6A38C2]/10 hover:text-[#6A38C2]"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    Auto-Generate with AI
                  </Button>
                </div>
                <textarea
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Describe the role, responsibilities, and team..."
                  className="input-field min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Requirements (One per line)</Label>
                <textarea
                  name="requirements"
                  value={input.requirements}
                  onChange={changeEventHandler}
                  placeholder="React.js&#10;3+ years experience&#10;Good communication..."
                  className="input-field min-h-[100px] resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
                <IndianRupee size={20} className="text-green-600" /> Compensation & Terms
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Salary Range</Label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="salary"
                      value={input.salary}
                      onChange={changeEventHandler}
                      placeholder="Amount"
                      className="input-field flex-1"
                      required
                    />
                    <select 
                      name="salaryType" 
                      value={input.salaryType} 
                      onChange={changeEventHandler}
                      className="input-field w-32 font-bold text-[#6A38C2]"
                    >
                      <option value="LPA">LPA</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Location</Label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={input.location}
                      onChange={changeEventHandler}
                      placeholder="e.g. Bangalore, Remote"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Job Type</Label>
                  <input
                    type="text"
                    name="jobType"
                    value={input.jobType}
                    onChange={changeEventHandler}
                    placeholder="Full-time, Internship"
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Experience (Yrs)</Label>
                  <input
                    type="number"
                    name="experience"
                    value={input.experience}
                    onChange={changeEventHandler}
                    placeholder="2"
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Vacancies</Label>
                  <input
                    type="number"
                    name="position"
                    value={input.position}
                    onChange={changeEventHandler}
                    placeholder="5"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
                <Target size={20} className="text-blue-500" /> Organization & Timeline
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Select Company</Label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                    <Select onValueChange={selectChangeHandler}>
                      <SelectTrigger className="input-field pl-10 h-12">
                        <SelectValue placeholder="Choose a company" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                        <SelectGroup>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="rounded-xl py-3 cursor-pointer">
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase">Application Deadline</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      name="deadline"
                      value={input.deadline}
                      onChange={changeEventHandler}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              {companies.length === 0 ? (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                  <p className="text-xs font-bold text-red-600">Please register a company first to post a job.</p>
                  <Link to="/admin/companies/create" className="text-xs font-black text-red-700 underline">Register Now</Link>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full btn-brand py-8 rounded-2xl text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Publishing Opportunity...
                    </>
                  ) : (
                    "Post Job Opportunity"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJob;
