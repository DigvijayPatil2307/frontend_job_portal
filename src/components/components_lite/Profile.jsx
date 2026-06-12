import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { 
  Contact, 
  Mail, 
  Pen, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Globe,
  Settings,
  ShieldCheck,
  Zap,
  Code
} from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import Footer from "./Footer";
import { motion } from "framer-motion";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const hasResume = !!user?.profile?.resume;
  
  // Calculate profile completion
  const completionFields = [
    user?.fullname,
    user?.email,
    user?.phoneNumber,
    user?.profile?.bio,
    user?.profile?.skills?.length > 0,
    user?.profile?.resume,
    user?.profile?.profilePhoto
  ];
  const completionPercentage = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const initials = user?.fullname?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Profile Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              {/* Cover Background */}
              <div className="h-32 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]" />
              
              <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="relative -mt-12 mb-6 inline-block">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback className="bg-slate-200 text-[#6A38C2] text-2xl font-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900">{user?.fullname}</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">{user?.role}</p>
                  </div>
                  <Button 
                    onClick={() => setOpen(true)} 
                    variant="outline" 
                    size="icon"
                    className="rounded-xl border-slate-200 hover:border-[#6A38C2] hover:text-[#6A38C2]"
                  >
                    <Pen size={16} />
                  </Button>
                </div>

                <p className="text-slate-600 text-sm mt-6 leading-relaxed">
                  {user?.profile?.bio || "No bio added yet. Tell recruiters about yourself!"}
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                      <Contact size={16} />
                    </div>
                    <span className="font-medium">{user?.phoneNumber}</span>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Strength</span>
                    <span className="text-xs font-black text-[#6A38C2]">{completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      className="h-full bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                <FileText size={20} className="text-[#6A38C2]" />
                Resume / CV
              </h3>
              {hasResume ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div className="max-w-[120px]">
                        <p className="text-xs font-bold truncate">{user?.profile?.resumeOriginalName || "Resume.pdf"}</p>
                        <p className="text-[10px] text-slate-500 uppercase">PDF Document</p>
                      </div>
                    </div>
                    <a 
                      href={user?.profile?.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors text-[#6A38C2]"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-4">No resume uploaded yet.</p>
                  <Button 
                    onClick={() => setOpen(true)}
                    className="w-full bg-[#6A38C2] hover:bg-[#8B5CF6] text-white rounded-xl"
                  >
                    Upload Now
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Section */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-6 bg-[#6A38C2] rounded-full" />
                Technical Skills
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-orange-500" /> Manually Added
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {user?.profile?.skills?.length > 0 ? (
                      user.profile.skills.map((item, index) => (
                        <Badge key={index} className="bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 px-4 py-1.5 rounded-xl text-sm font-semibold">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm italic">Add your skills to stand out.</span>
                    )}
                  </div>
                </div>

                {user?.profile?.extractedSkills?.length > 0 && (
                  <div className="pt-8 border-t border-slate-50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Code size={14} className="text-[#6A38C2]" /> Auto-Detected from Resume
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {user.profile.extractedSkills.map((item, index) => (
                        <Badge key={index} className="bg-[#6A38C2]/5 text-[#6A38C2] border-[#6A38C2]/10 px-4 py-1.5 rounded-xl text-sm font-bold">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Applications Section */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-6 bg-[#F83002] rounded-full" />
                Application History
              </h2>
              <AppliedJob />
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal open={open} setOpen={setOpen} />
      <Footer />
    </div>
  );
};

export default Profile;
