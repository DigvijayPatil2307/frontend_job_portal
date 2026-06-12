import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Rocket, 
  Heart, 
  Briefcase, 
  ShieldCheck, 
  Globe, 
  Award 
} from "lucide-react";

const About = () => {
  const stats = [
    { label: "Active Users", value: "50k+", icon: <Users size={20} /> },
    { label: "Job Placements", value: "12k+", icon: <Briefcase size={20} /> },
    { label: "Partner Companies", value: "500+", icon: <Award size={20} /> },
    { label: "Global Reach", value: "20+", icon: <Globe size={20} /> },
  ];

  const values = [
    {
      title: "User Centric",
      description: "We build for the job seeker first, ensuring every feature adds real value to their career journey.",
      icon: <Heart className="text-red-500" />
    },
    {
      title: "Innovation",
      description: "Leveraging AI and modern tech to match the right talent with the right opportunity faster than ever.",
      icon: <Rocket className="text-blue-500" />
    },
    {
      title: "Integrity",
      description: "Transparency and trust are the foundation of our platform. We verify every company and posting.",
      icon: <ShieldCheck className="text-green-500" />
    },
    {
      title: "Excellence",
      description: "We don't settle for 'good enough'. Our goal is to provide a premium experience for every user.",
      icon: <Target className="text-[#6A38C2]" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-gradient py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 mb-6"
          >
            Empowering Careers, <br />
            <span className="text-[#6A38C2]">Connecting Talent</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Job Portal is more than just a recruitment platform. We are a bridge between dreams and reality, 
            helping millions of professionals find their place in the modern workforce.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#6A38C2]">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-4">
              <div className="w-2 h-8 bg-[#6A38C2] rounded-full" />
              Our Mission
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                Founded in 2024, Job Portal was born out of a simple observation: the job search process was broken. 
                Talented individuals were getting lost in legacy systems, while companies struggled to find the specific 
                skills they needed.
              </p>
              <p>
                We set out to build a platform that prioritizes **clarity, efficiency, and human connection**. By 
                leveraging state-of-the-art resume parsing and intelligent matching, we've reduced the average time-to-hire 
                by 40%.
              </p>
              <p className="font-bold text-slate-900">
                Today, we serve thousands of recruiters and millions of job seekers across India, 
                making us the fastest-growing recruitment ecosystem in the region.
              </p>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-[#6A38C2]/5 rounded-[40px] rotate-3 -z-10" />
             <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Team working together" 
                  className="rounded-[32px] w-full h-[400px] object-cover"
                />
             </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Core Values</h2>
            <p className="text-slate-400">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
