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
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Briefcase, Building2, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <Table>
        <TableCaption className="pb-4 text-slate-400">A list of your recently applied jobs.</TableCaption>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold text-slate-600">Date</TableHead>
            <TableHead className="font-bold text-slate-600">Job Title</TableHead>
            <TableHead className="font-bold text-slate-600">Company</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                You haven't applied to any jobs yet. Start exploring!
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {appliedJob?.createdAt.split("T")[0]}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-[#6A38C2]" />
                    {appliedJob.job?.title}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    {appliedJob.job?.company.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${
                      appliedJob?.status === "rejected"
                        ? "bg-red-50 text-red-600 hover:bg-red-50 border-red-100"
                        : appliedJob?.status === "accepted"
                        ? "bg-green-50 text-green-600 hover:bg-green-50 border-green-100"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-100"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {appliedJob?.status === "rejected" && <XCircle size={10} />}
                      {appliedJob?.status === "accepted" && <CheckCircle2 size={10} />}
                      {appliedJob?.status === "pending" && <Clock size={10} />}
                      {appliedJob?.status}
                    </div>
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJob;
