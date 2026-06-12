import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { Loader2, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/verify-email`, {
        email,
        otp: otpValue
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendHandler = async () => {
    try {
      setResending(true);
      const res = await axios.post(`${USER_API_ENDPOINT}/resend-otp`, { email });
      if (res.data.success) {
        toast.success("New OTP sent to your email");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/register" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#6A38C2] transition-colors mb-6 font-medium text-sm">
          <ArrowLeft size={16} /> Back to Register
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-[#6A38C2]/10 text-[#6A38C2] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800">Verify Email</h1>
          <p className="text-slate-500 text-sm mt-2">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-slate-700">{email}</span>
          </p>

          <form onSubmit={submitHandler} className="mt-8">
            <div className="flex justify-between gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-100 focus:border-[#6A38C2] focus:bg-[#6A38C2]/5 outline-none transition-all"
                />
              ))}
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-brand py-6">
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
            </Button>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <p className="text-sm text-slate-500">
                Didn't receive the code?
              </p>
              <button
                type="button"
                disabled={timer > 0 || resending}
                onClick={resendHandler}
                className={`mt-2 flex items-center justify-center gap-2 mx-auto font-semibold text-sm transition-colors ${
                  timer > 0 ? "text-slate-300" : "text-[#6A38C2] hover:text-[#8B5CF6]"
                }`}
              >
                {resending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
