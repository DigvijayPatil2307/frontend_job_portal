import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  // Fetch jobs on mount
  useGetAllJobs();
  
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Industry standard: Redirect recruiters to their management dashboard
    if (user?.role === "Recruiter") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      <Navbar />
      <Header />
      <Categories />
      <LatestJobs />
      <Footer />
    </motion.div>
  );
};

export default Home;
