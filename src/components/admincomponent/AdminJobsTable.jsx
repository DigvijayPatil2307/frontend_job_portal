import React, { useEffect, useState } from "react";
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
  Edit2, 
  Eye, 
  Calendar, 
  Briefcase, 
  Users, 
  Clock,
  ArrowRight,
  Trash2
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { setAllAdminJobs } from "@/redux/jobSlice";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJob, setFilterJob] = useState(allAdminJobs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_ENDPOINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAllAdminJobs(allAdminJobs.filter((job) => job._id !== jobId)));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {
    const filteredJob = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJob(filteredJob);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-50">
      <Table>
        <TableCaption className="pb-4 text-slate-400">A list of your recently posted jobs.</TableCaption>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold text-slate-600">Company</TableHead>
            <TableHead className="font-bold text-slate-600">Role</TableHead>
            <TableHead className="font-bold text-slate-600">Date</TableHead>
            <TableHead className="font-bold text-slate-600">Applicants</TableHead>
            <TableHead className="font-bold text-slate-600">Status</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJob?.length > 0 ? (
            filterJob.map((job) => (
              <TableRow key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt="Logo" className="w-6 h-6 object-contain" />
                      ) : (
                        <Briefcase size={14} className="text-slate-300" />
                      )}
                    </div>
                    <span className="font-bold text-slate-700">{job?.company?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-black text-slate-900 group-hover:text-[#6A38C2] transition-colors">{job?.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job?.category || "Tech"}</p>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 font-medium text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {job?.createdAt?.split("T")[0]}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-blue-500" />
                    <span className="font-black text-slate-700">{job?.applications?.length || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`rounded-lg px-2 py-0.5 font-bold text-[9px] uppercase tracking-wider ${
                      job.isActive && (!job.deadline || new Date(job.deadline) >= new Date())
                        ? "bg-green-50 text-green-600" 
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {job.isActive && (!job.deadline || new Date(job.deadline) >= new Date()) ? "Active" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <MoreHorizontal size={20} className="text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 rounded-2xl shadow-xl border-slate-100" align="end">
                      <div className="space-y-1">
                        <button
                          onClick={() => navigate(`/admin/companies/${job.company._id}`)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Edit2 size={14} className="text-blue-500" /> Edit Job
                        </button>
                        <button
                          onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#6A38C2] bg-[#6A38C2]/5 hover:bg-[#6A38C2]/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Eye size={14} /> View Applicants
                          </div>
                          <ArrowRight size={12} />
                        </button>
                        <div className="h-px bg-slate-50 my-1" />
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} className="text-red-500" /> Delete Job
                        </button>
                        <div className="h-px bg-slate-50 my-1" />
                        <div className="px-3 py-2">
                           <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                             <Clock size={10} /> Closing: {new Date(job.deadline).toLocaleDateString()}
                           </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium italic">
                No matching job postings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
