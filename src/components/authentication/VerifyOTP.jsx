import React, { useState } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { Loader2, KeySquare, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const VerifyOTP = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const email = state.email;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/verify-otp`, { email, otp });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/reset-password", { state: { email, otp } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
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
          <div className="w-16 h-16 bg-[#6A38C2]/10 text-[#6A38C2] rounded-2xl flex items-center justify-center mb-6">
            <KeySquare size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Verify OTP</h1>
          <p className="text-slate-500 text-sm mt-2">
            Enter the 6-digit OTP sent to <span className="font-bold text-slate-700">{email}</span>.
          </p>

          <form onSubmit={submitHandler} className="mt-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">6-Digit OTP</label>
              <div className="relative">
                <KeySquare size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="input-field pl-10 tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-brand py-6">
              {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
