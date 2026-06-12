import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Eye, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  Building2
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Footer from "../components_lite/Footer";

const RecruiterDashboard = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Recruiter") {
      navigate("/");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/analytics`, { withCredentials: true });
        if (res.data.success) {
          setAnalytics(res.data.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, navigate]);

  const stats = [
    { label: "Total Jobs Posted", value: analytics?.totalJobs || 0, icon: <Briefcase />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Applicants", value: analytics?.totalApplications || 0, icon: <Users />, color: "bg-[#6A38C2]/10 text-[#6A38C2]" },
    { label: "Total Views", value: analytics?.totalViews || 0, icon: <Eye />, color: "bg-orange-50 text-orange-600" },
    { label: "Active Postings", value: analytics?.activeJobs || 0, icon: <CheckCircle2 />, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="hero-gradient border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Recruiter Dashboard</h1>
              <p className="text-slate-500 mt-1">Monitor your recruitment performance and manage your postings.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/companies/create">
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                  <Building2 size={18} /> Register Company
                </button>
              </Link>
              <Link to="/admin/jobs/create">
                <button className="flex items-center gap-2 px-6 py-3 btn-brand rounded-xl font-bold text-sm shadow-lg hover:shadow-[#6A38C2]/20 transition-all">
                  <PlusCircle size={18} /> Post New Job
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className="text-3xl font-black text-slate-900">{stat.value}</h2>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <TrendingUp size={20} className="text-[#6A38C2]" />
                  Top Performing Jobs
                </h2>
                <Link to="/admin/jobs" className="text-xs font-bold text-[#6A38C2] hover:underline uppercase tracking-wider">
                  Manage All →
                </Link>
              </div>

              <div className="space-y-4">
                {analytics?.topJobs?.length > 0 ? (
                  analytics.topJobs.map((job, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#6A38C2]/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-[#6A38C2] border border-slate-100">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-[#6A38C2] transition-colors">{job.title}</h4>
                          <p className="text-xs text-slate-400 font-medium">
                            {job.isActive ? "🟢 Active Posting" : "🔴 Closed Posting"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-8">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Applicants</p>
                          <p className="text-sm font-black text-slate-800">{job.applications}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Views</p>
                          <p className="text-sm font-black text-slate-800">{job.views}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-slate-400">No job data available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions / Tips */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} />
              </div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Recruitment Tip</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                Jobs with detailed requirements and salary information receive up to <span className="text-[#6A38C2] font-bold">40% more</span> quality applicants.
              </p>
              <Button onClick={() => navigate("/admin/jobs/create")} className="w-full bg-[#6A38C2] hover:bg-[#8B5CF6] text-white rounded-xl relative z-10">
                Post Optimized Job
              </Button>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#6A38C2] mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">New Applicant</p>
                    <p className="text-xs text-slate-500">Someone applied for Senior React Role</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Job Posted</p>
                    <p className="text-xs text-slate-500">New opening for UI/UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Zap = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default RecruiterDashboard;
