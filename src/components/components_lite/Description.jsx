import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, JOB_API_ENDPOINT, AI_API_ENDPOINT } from "@/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  Users, 
  Building2, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Share2,
  Globe,
  Sparkles,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "./Footer";

const Description = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied = singleJob?.applications?.some(
    (application) => application.applicant === user?._id
  ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const [applying, setApplying] = useState(false);
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    try {
      setApplying(true);
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        { coverLetter },
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        // Update local job state to include the new application
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
        setOpenApplyModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const generateCoverLetterHandler = async () => {
    try {
      setIsGenerating(true);
      const res = await axios.post(
        `${AI_API_ENDPOINT}/generate-cover-letter`,
        { jobId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setCoverLetter(res.data.coverLetter);
        toast.success("Cover letter generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    setOpenApplyModal(true);
  };

  const shareJobHandler = () => {
    const url = window.location.href;
    const title = `Check out this job: ${singleJob?.title} at ${singleJob?.company?.name}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url
      }).catch(() => {
        // Fallback to clipboard if share cancelled/failed
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant?._id === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  if (!singleJob) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      {/* Header Section */}
      <div className="hero-gradient border-b border-slate-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] font-bold text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Search
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                {singleJob?.company?.logo ? (
                  <img src={singleJob.company.logo} alt="Logo" className="w-14 h-14 object-contain" />
                ) : (
                  <Building2 size={40} className="text-[#6A38C2]/20" />
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
                  {singleJob?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 hover:text-[#6A38C2] cursor-pointer">
                    <Building2 size={16} /> {singleJob?.company?.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} /> {singleJob?.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} /> Posted {new Date(singleJob?.createdAt).toLocaleDateString()}
                  </span>
                  {(() => {
                    if (!user || !user.profile?.extractedSkills?.length || !singleJob?.requirements?.length) return null;
                    const userSkills = user.profile.extractedSkills.map(s => s.toLowerCase());
                    const jobReqs = singleJob.requirements.map(s => s.toLowerCase());
                    let matches = 0;
                    jobReqs.forEach(req => {
                      if (userSkills.some(skill => req.includes(skill) || skill.includes(req))) matches++;
                    });
                    const score = Math.round((matches / jobReqs.length) * 100);
                    const badgeColor = score > 75 ? "bg-green-50 text-green-600" : score >= 50 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500";
                    return (
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                        <Sparkles size={14} /> {score}% Match
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={shareJobHandler}
                variant="outline" 
                className="rounded-xl p-6 border-slate-200 hover:bg-[#6A38C2]/5 hover:border-[#6A38C2]/20 transition-all"
              >
                <Share2 size={18} className="mr-2" /> Share
              </Button>
              <Button
                onClick={isApplied ? null : handleOpenApplyModal}
                disabled={isApplied || applying}
                className={`rounded-xl px-10 py-6 font-bold shadow-lg transition-all ${
                  isApplied
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "btn-brand animate-pulse-glow"
                }`}
              >
                {isApplied ? "Already Applied" : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-[#6A38C2] rounded-full" />
                Job Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {singleJob?.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-[#F83002] rounded-full" />
                Key Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {singleJob?.requirements?.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-black text-slate-900">Job Overview</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <IndianRupee size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salary</p>
                    <p className="text-slate-900 font-black">{singleJob?.salary} LPA</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                    <p className="text-slate-900 font-black">{singleJob?.experienceLevel} Years</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Positions</p>
                    <p className="text-slate-900 font-black">{singleJob?.position} Vacancies</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Posted</p>
                    <p className="text-slate-900 font-black">{new Date(singleJob?.createdAt).toDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-6">
              <h3 className="text-lg font-bold">About {singleJob?.company?.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-4">
                {singleJob?.company?.description || "No description available for this company."}
              </p>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-[#6A38C2]" />
                  <span className="text-xs font-bold">techcorp.in</span>
                </div>
                <Button variant="link" className="text-[#6A38C2] p-0 h-auto font-bold text-xs uppercase tracking-widest">
                  View Profile →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openApplyModal} onOpenChange={setOpenApplyModal}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900">Submit Application</DialogTitle>
            <DialogDescription className="text-slate-500">
              Applying for <span className="font-bold text-slate-800">{singleJob?.title}</span> at <span className="font-bold text-slate-800">{singleJob?.company?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 uppercase">Cover Letter (Optional)</label>
              <Button
                type="button"
                variant="ghost"
                onClick={generateCoverLetterHandler}
                disabled={isGenerating}
                className="h-8 text-xs font-bold text-[#6A38C2] hover:bg-[#6A38C2]/10 hover:text-[#6A38C2]"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                Auto-Generate with AI
              </Button>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter or use AI to generate one..."
              className="w-full min-h-[200px] p-4 text-sm border border-slate-200 rounded-2xl focus:border-[#6A38C2] focus:ring-4 focus:ring-[#6A38C2]/10 outline-none resize-none bg-slate-50/50 transition-all"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenApplyModal(false)} className="rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button onClick={applyJobHandler} disabled={applying} className="btn-brand rounded-xl px-8">
              {applying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Description;
