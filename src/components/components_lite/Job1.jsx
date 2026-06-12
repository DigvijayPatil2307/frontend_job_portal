import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bookmark, BookmarkCheck, MapPin, IndianRupee, Clock, Building2, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { updateSavedJobs } from "@/redux/authSlice";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [saving, setSaving] = useState(false);

  const isSaved = user?.savedJobs?.includes(job?._id);

  const saveJobHandler = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }
    try {
      setSaving(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/save-job/${job._id}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        // Update local state
        const newSaved = isSaved 
          ? user.savedJobs.filter(id => id !== job._id)
          : [...(user.savedJobs || []), job._id];
        dispatch(updateSavedJobs(newSaved));
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    } finally {
      setSaving(false);
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="job-card group flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Clock size={12} className="text-[#6A38C2]" />
          {daysAgo === 0 ? "Posted Today" : `${daysAgo} days ago`}
        </span>
        <div className="flex items-center gap-2">
          {(() => {
            if (!user || !user.profile?.extractedSkills?.length || !job?.requirements?.length) return null;
            const userSkills = user.profile.extractedSkills.map(s => s.toLowerCase());
            const jobReqs = job.requirements.map(s => s.toLowerCase());
            let matches = 0;
            jobReqs.forEach(req => {
              if (userSkills.some(skill => req.includes(skill) || skill.includes(req))) {
                matches++;
              }
            });
            const score = Math.round((matches / jobReqs.length) * 100);
            const badgeColor = score > 75 ? "bg-green-50 text-green-600" : score >= 50 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500";
            return (
              <Badge className={`border-none font-bold text-[10px] px-2 py-1 ${badgeColor}`}>
                {score}% Match
              </Badge>
            );
          })()}
          <button
          onClick={saveJobHandler}
          disabled={saving}
          className={`p-2 rounded-xl transition-all ${
            isSaved 
              ? "bg-[#6A38C2]/10 text-[#6A38C2]" 
              : "bg-slate-50 text-slate-400 hover:text-[#6A38C2] hover:bg-[#6A38C2]/5"
          }`}
        >
          {isSaved ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
        </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-[#6A38C2]/20 transition-colors">
          {job?.company?.logo ? (
            <img src={job.company.logo} alt="Logo" className="w-10 h-10 object-contain" />
          ) : (
            <Building2 className="text-slate-200 group-hover:text-[#6A38C2]/40 transition-colors" size={28} />
          )}
        </div>
        <div>
          <h1 className="font-black text-slate-900 text-lg group-hover:text-[#6A38C2] transition-colors leading-tight line-clamp-1">
            {job?.title}
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
            {job?.company?.name}
          </p>
        </div>
      </div>

      <div className="flex-grow">
        <p className="text-slate-500 text-sm line-clamp-3 mb-6">
          {job?.description}
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={14} className="text-[#6A38C2]" />
            <span className="text-xs font-semibold">{job?.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-900">
            <IndianRupee size={14} className="text-green-600" />
            <span className="text-xs font-black">{job?.salary} LPA</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-[#6A38C2]/5 text-[#6A38C2] border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
            {job?.position} Positions
          </Badge>
          <Badge className="bg-orange-50 text-orange-600 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
            {job?.experienceLevel} Years Exp
          </Badge>
          <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] px-2.5 py-1 rounded-lg">
            {job?.jobType}
          </Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => navigate(`/description/${job?._id}`)}
            className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-5"
          >
            Details
          </Button>
          <Button
            onClick={saveJobHandler}
            variant="outline"
            className={`rounded-xl font-bold text-xs py-5 ${
              isSaved ? "border-[#6A38C2] text-[#6A38C2] bg-[#6A38C2]/5" : "border-slate-200"
            }`}
          >
            {isSaved ? "Saved" : "Save For Later"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Job1;
