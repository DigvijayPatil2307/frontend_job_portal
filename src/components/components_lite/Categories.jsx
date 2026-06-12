import React from "react";
import { 
  Code2, 
  BarChart3, 
  Palette, 
  Megaphone, 
  UserSquare2, 
  Cpu, 
  Briefcase, 
  Globe2 
} from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";

const categories = [
  { name: "Frontend Developer", icon: <Code2 size={24} />, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Backend Developer", icon: <Cpu size={24} />, color: "text-[#6A38C2]", bg: "bg-[#6A38C2]/5" },
  { name: "Data Science", icon: <BarChart3 size={24} />, color: "text-green-500", bg: "bg-green-50" },
  { name: "Graphic Designer", icon: <Palette size={24} />, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "Fullstack Developer", icon: <Globe2 size={24} />, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Marketing", icon: <Megaphone size={24} />, color: "text-yellow-600", bg: "bg-yellow-50" },
  { name: "HR Manager", icon: <UserSquare2 size={24} />, color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: "Product Manager", icon: <Briefcase size={24} />, color: "text-indigo-500", bg: "bg-indigo-50" },
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/Browse");
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Explore by Category</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Browse through diverse industries and find the role that matches your expertise and passion.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => searchJobHandler(cat.name)}
              className="group cursor-pointer p-6 rounded-3xl border border-slate-100 hover:border-[#6A38C2]/20 hover:shadow-xl hover:shadow-[#6A38C2]/5 transition-all duration-300 bg-white"
            >
              <div className={`w-14 h-14 ${cat.bg} ${cat.color} rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-[#6A38C2] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Explore Jobs →
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
