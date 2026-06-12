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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal, Edit2, Globe, MapPin, Building2, Calendar, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-50">
      <Table>
        <TableCaption className="pb-4 text-slate-400">A list of your registered companies.</TableCaption>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold text-slate-600">Logo</TableHead>
            <TableHead className="font-bold text-slate-600">Name</TableHead>
            <TableHead className="font-bold text-slate-600">Industry</TableHead>
            <TableHead className="font-bold text-slate-600">Location</TableHead>
            <TableHead className="font-bold text-slate-600">Created At</TableHead>
            <TableHead className="text-right font-bold text-slate-600">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany?.length > 0 ? (
            filterCompany.map((company) => (
              <TableRow key={company._id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell>
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm rounded-xl">
                    <AvatarImage src={company.logo} className="object-contain p-1" />
                    <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <Building2 size={16} />
                    </div>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <span className="font-black text-slate-900 group-hover:text-[#6A38C2] transition-colors">
                    {company.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {company.industry || "General"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                    <MapPin size={12} />
                    {company.location || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-xs">
                   <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {company.createdAt?.split("T")[0]}
                  </div>
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
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#6A38C2] bg-[#6A38C2]/5 hover:bg-[#6A38C2]/10 transition-colors group/btn"
                        >
                          <div className="flex items-center gap-3">
                            <Edit2 size={14} /> Edit Details
                          </div>
                          <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Globe size={14} className="text-blue-500" /> Visit Website
                          </a>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium italic">
                No companies found. Register one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
