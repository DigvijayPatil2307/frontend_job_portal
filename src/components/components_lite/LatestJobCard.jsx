import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, IndianRupee, Building2 } from "lucide-react";

const LatestJobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#6A38C2]/30 shadow-sm hover:shadow-2xl hover:shadow-[#6A38C2]/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#6A38C2]/5 transition-colors">
            {job?.company?.logo ? (
              <img src={job.company.logo} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <Building2 className="text-slate-400 group-hover:text-[#6A38C2] transition-colors" size={24} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
              {job?.title}
            </h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {job?.company?.name}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
          {job?.jobType}
        </div>
      </div>

      <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">
        {job?.description}
      </p>

      <div className="space-y-3 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={14} className="text-[#6A38C2]" />
            <span className="text-xs font-medium">{job?.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <IndianRupee size={14} className="text-green-600" />
            <span className="text-xs font-bold text-slate-700">{job?.salary} LPA</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-50 text-blue-600 border-none hover:bg-blue-50 text-[10px] font-bold px-2 py-0.5 rounded-md">
            {job?.position} Positions
          </Badge>
          <Badge className="bg-orange-50 text-orange-600 border-none hover:bg-orange-50 text-[10px] font-bold px-2 py-0.5 rounded-md">
            {job?.experienceLevel} Years Exp
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCard;
