import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Button } from "../ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Briefcase, 
  Upload, 
  Loader2, 
  ArrowRight, 
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Account, 2: Profile Photo/Role

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validateStep1 = () => {
    const e = {};
    if (!input.fullname.trim()) e.fullname = "Full name is required";
    if (!input.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) e.email = "Invalid email";
    if (!input.phoneNumber.trim()) e.phoneNumber = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(input.phoneNumber)) e.phoneNumber = "Invalid 10-digit mobile";
    if (!input.password) e.password = "Password is required";
    else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input.password)) {
      e.password = "Must be 8+ chars with Uppercase, Number & Special Char";
    }
    return e;
  };

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const fileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setStep(2);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.role) {
      toast.error("Please select a role");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/verify-email?email=${encodeURIComponent(input.email)}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#6A38C2]" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? "border-[#6A38C2] bg-[#6A38C2]/10" : "border-slate-300"}`}>
              1
            </div>
            <span className="text-sm font-semibold">Account</span>
          </div>
          <div className={`h-px w-8 bg-slate-300 ${step === 2 ? "bg-[#6A38C2]" : ""}`} />
          <div className={`flex items-center gap-2 ${step === 2 ? "text-[#6A38C2]" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 2 ? "border-[#6A38C2] bg-[#6A38C2]/10" : "border-slate-300"}`}>
              2
            </div>
            <span className="text-sm font-semibold">Profile</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] p-8 text-white text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-purple-100 text-sm mt-1">Join India's #1 Job Platform</p>
          </div>

          <form onSubmit={submitHandler} className="p-8">
            {step === 1 ? (
              <div className="space-y-4 animate-fade-in-up">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="fullname"
                      value={input.fullname}
                      onChange={changeHandler}
                      placeholder="John Doe"
                      className={`input-field pl-10 ${errors.fullname ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.fullname && <p className="field-error">{errors.fullname}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeHandler}
                      placeholder="john@example.com"
                      className={`input-field pl-10 ${errors.email ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={input.phoneNumber}
                      onChange={changeHandler}
                      placeholder="9876543210"
                      className={`input-field pl-10 ${errors.phoneNumber ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="field-error">{errors.phoneNumber}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={changeHandler}
                      placeholder="••••••••"
                      className={`input-field pl-10 ${errors.password ? "border-red-400" : ""}`}
                    />
                  </div>
                  {errors.password && <p className="field-error">{errors.password}</p>}
                </div>

                <Button type="button" onClick={nextStep} className="w-full btn-brand mt-6">
                  Next Step <ArrowRight size={18} />
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-center w-full">
                    Profile Photo (Optional)
                  </label>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#6A38C2]">
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-400" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-[#6A38C2] text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                      <Upload size={16} />
                      <input type="file" onChange={fileHandler} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">JPG, PNG or WebP. Max 5MB</p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Join as a</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Student", "Recruiter"].map((r) => (
                      <label
                        key={r}
                        className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          input.role === r
                            ? "border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]"
                            : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r}
                          checked={input.role === r}
                          onChange={changeHandler}
                          className="hidden"
                        />
                        <div className={`p-3 rounded-xl ${input.role === r ? "bg-[#6A38C2] text-white" : "bg-white text-slate-400 shadow-sm"}`}>
                          <Briefcase size={20} />
                        </div>
                        <span className="font-bold text-sm">{r}</span>
                        {input.role === r && <CheckCircle2 size={16} className="absolute top-2 right-2" />}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl py-6">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-[2] btn-brand">
                    {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-slate-500 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-[#6A38C2] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
