import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Mail, 
  Phone,
  User,
  ExternalLink,
  History,
  Sparkles,
  Loader2,
  Trophy,
  TrendingUp
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT, AI_API_ENDPOINT } from "@/utils/data";
import { Badge } from "../ui/badge";

const shortlistingStatus = [
  { status: "Shortlisted", icon: <History size={14} />, color: "text-blue-600 hover:bg-blue-50" },
  { status: "Interview", icon: <Mail size={14} />, color: "text-purple-600 hover:bg-purple-50" },
  { status: "Accepted", icon: <CheckCircle2 size={14} />, color: "text-green-600 hover:bg-green-50" },
  { status: "Rejected", icon: <XCircle size={14} />, color: "text-red-600 hover:bg-red-50" },
];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [summaries, setSummaries] = React.useState({});
  const [generatingSummaries, setGeneratingSummaries] = React.useState({});
  const [showTopOnly, setShowTopOnly] = React.useState(false);

  // Filter applications based on showTopOnly toggle
  const displayedApplications = React.useMemo(() => {
    const apps = applicants?.applications || [];
    if (showTopOnly) return apps.filter((app) => (app.matchScore ?? 0) >= 75);
    return apps;
  }, [applicants?.applications, showTopOnly]);

  const generateSummaryHandler = async (applicantId, jobId) => {
    if (summaries[applicantId]) return; // Already generated
    
    try {
      setGeneratingSummaries((prev) => ({ ...prev, [applicantId]: true }));
      const res = await axios.post(
        `${AI_API_ENDPOINT}/generate-candidate-summary`,
        { applicantId, jobId },
        { withCredentials: true }
      );
      if (res.data.success) {
        setSummaries((prev) => ({ ...prev, [applicantId]: res.data.summary }));
        toast.success("Summary generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate summary");
    } finally {
      setGeneratingSummaries((prev) => ({ ...prev, [applicantId]: false }));
    }
  };

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status: status.toLowerCase() },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh page to show updated status
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="space-y-4 mb-12">
      {/* Filter Bar */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-slate-500 font-medium">
          <span className="font-black text-slate-800">{displayedApplications.length}</span>{" "}
          {showTopOnly ? "top matches" : "total applicants"}
        </p>
        <button
          onClick={() => setShowTopOnly((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            showTopOnly
              ? "bg-[#6A38C2] text-white shadow-lg shadow-[#6A38C2]/25"
              : "bg-slate-100 text-slate-600 hover:bg-[#6A38C2]/10 hover:text-[#6A38C2]"
          }`}
        >
          <Trophy size={14} />
          {showTopOnly ? "Showing Top Matches" : "Show Top Matches Only"}
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <Table>
        <TableCaption className="pb-4 text-slate-400">Candidates are ranked by match score — best fits appear first.</TableCaption>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600">Match</TableHead>
            <TableHead className="font-bold text-slate-600">Applicant Info</TableHead>
            <TableHead className="font-bold text-slate-600">Top Skills (Extracted)</TableHead>
            <TableHead className="font-bold text-slate-600">Resume & Contact</TableHead>
            <TableHead className="font-bold text-slate-600">Date</TableHead>
            <TableHead className="font-bold text-slate-600">Stage</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedApplications.length > 0 ? (
            displayedApplications.map((item) => {
              const score = item.matchScore ?? 0;
              const isTopMatch = score >= 75;
              const scoreColor = score >= 75
                ? "bg-green-50 text-green-700 border-green-200"
                : score >= 50
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-500 border-slate-200";
              return (
              <TableRow key={item._id} className={`hover:bg-slate-50/50 transition-colors group ${isTopMatch ? "bg-green-50/30" : ""}`}>
                <TableCell>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`text-sm font-black px-2.5 py-1 rounded-xl border ${scoreColor}`}>
                      {score}%
                    </div>
                    {isTopMatch && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-amber-600">
                        <Trophy size={10} className="text-amber-500" /> Top Match
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#6A38C2]/10 text-[#6A38C2] flex items-center justify-center font-bold text-sm border border-[#6A38C2]/20">
                      {item?.applicant?.fullname?.[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{item?.applicant?.fullname}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Applied {item?.applicant?.role}
                      </p>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <button 
                            onClick={() => generateSummaryHandler(item?.applicant?._id, item?.job)}
                            className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#6A38C2] hover:text-[#8B5CF6] transition-colors"
                          >
                            {generatingSummaries[item?.applicant?._id] ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Sparkles size={12} />
                            )}
                            AI Summary
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-slate-100" align="start">
                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                              <Sparkles size={14} className="text-[#6A38C2]" /> AI Candidate Evaluation
                            </h4>
                            {generatingSummaries[item?.applicant?._id] ? (
                              <p className="text-sm text-slate-500 italic flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Analyzing profile...
                              </p>
                            ) : summaries[item?.applicant?._id] ? (
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {summaries[item?.applicant?._id]}
                              </p>
                            ) : (
                              <p className="text-sm text-slate-500 italic">Failed to load summary.</p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item?.applicant?.profile?.extractedSkills?.length > 0 ? (
                      item.applicant.profile.extractedSkills.slice(0, 4).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-600 text-[9px] px-1.5 py-0 border-slate-100">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-300 italic">No skills extracted</span>
                    )}
                    {item?.applicant?.profile?.extractedSkills?.length > 4 && (
                      <span className="text-[9px] text-[#6A38C2] font-bold">+{item.applicant.profile.extractedSkills.length - 4} more</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    {item.applicant?.profile?.resume ? (
                      <a
                        href={item?.applicant?.profile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#6A38C2] hover:text-[#8B5CF6] transition-colors"
                      >
                        <FileText size={14} /> View CV
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300 italic">No CV</span>
                    )}
                    <div className="flex items-center gap-4">
                      <a href={`mailto:${item?.applicant?.email}`} className="text-slate-400 hover:text-blue-500 transition-colors">
                        <Mail size={12} />
                      </a>
                      <a href={`tel:${item?.applicant?.phoneNumber}`} className="text-slate-400 hover:text-green-500 transition-colors">
                        <Phone size={12} />
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-[10px] font-bold uppercase">
                  {item?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-lg px-2.5 py-1 font-bold text-[9px] uppercase tracking-wider ${
                      item.status === "accepted"
                        ? "bg-green-50 text-green-600"
                        : item.status === "rejected"
                        ? "bg-red-50 text-red-600"
                        : item.status === "shortlisted"
                        ? "bg-blue-50 text-blue-600"
                        : item.status === "interview"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <MoreHorizontal size={20} className="text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-2 rounded-2xl shadow-xl border-slate-100" align="end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase px-3 py-2 border-b border-slate-50 mb-1">
                          Move to Stage
                        </p>
                        {shortlistingStatus.map((status, index) => (
                          <button
                            key={index}
                            onClick={() => statusHandler(status.status, item?._id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black transition-all hover:scale-[1.02] active:scale-95 ${status.color}`}
                          >
                            <div className="w-5 flex justify-center">{status.icon}</div>
                            {status.status}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                    <User size={24} />
                  </div>
                  <p className="text-slate-400 font-medium text-sm italic">
                    {showTopOnly ? "No top matches found. Try viewing all applicants." : "No applications received yet."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  );
};

export default ApplicantsTable;
