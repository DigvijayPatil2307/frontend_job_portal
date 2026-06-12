import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Eye, EyeOff, Mail, Lock, Loader2, Briefcase } from "lucide-react";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "Recruiter" ? "/admin/companies" : "/");
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!input.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(input.email)) newErrors.email = "Enter a valid email";
    if (!input.password) newErrors.password = "Password is required";
    if (!input.role) newErrors.role = "Please select your role";
    return newErrors;
  };

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/login`,
        { email: input.email.toLowerCase(), password: input.password, role: input.role },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate(res.data.user.role === "Recruiter" ? "/admin/companies" : "/");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);

      // If email not verified, redirect to verify page
      if (error.response?.data?.requiresVerification) {
        navigate(`/verify-email?email=${encodeURIComponent(input.email)}`);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl font-black">
              <span className="text-[#6A38C2]">Job</span>
              <span className="text-[#F83002]">Portal</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={submitHandler} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeHandler}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#6A38C2] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeHandler}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm transition-all outline-none ${
                    errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Student", "Recruiter"].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      input.role === role
                        ? "border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={input.role === role}
                      onChange={changeHandler}
                      className="hidden"
                    />
                    <Briefcase size={15} />
                    {role}
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.role}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #6A38C2, #8B5CF6)" }}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#6A38C2] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
