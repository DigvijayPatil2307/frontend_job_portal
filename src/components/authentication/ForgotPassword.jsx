import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { Mail, Loader2, ArrowLeft, Send } from "lucide-react";
import { Button } from "../ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-otp", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] transition-colors mb-6 font-medium text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="w-16 h-16 bg-[#F83002]/10 text-[#F83002] rounded-2xl flex items-center justify-center mb-6">
            <Send size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Forgot Password?</h1>
          <p className="text-slate-500 text-sm mt-2">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>

          <form onSubmit={submitHandler} className="mt-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-brand py-6">
              {loading ? <Loader2 className="animate-spin" /> : "Send Reset OTP"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
