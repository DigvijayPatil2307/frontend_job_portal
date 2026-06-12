import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  LogOut,
  User2,
  Menu,
  X,
  Briefcase,
  Building2,
  Home,
  Search,
  BookmarkCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/logout`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { to: "/Home", label: "Home", icon: <Home size={16} /> },
    { to: "/Jobs", label: "Jobs", icon: <Briefcase size={16} /> },
    { to: "/Browse", label: "Browse", icon: <Search size={16} /> },
    { to: "/About", label: "About", icon: null },
  ];

  const recruiterLinks = [
    { to: "/admin/companies", label: "Companies", icon: <Building2 size={16} /> },
    { to: "/admin/jobs", label: "Jobs", icon: <Briefcase size={16} /> },
  ];

  const navLinks = user?.role === "Recruiter" ? recruiterLinks : studentLinks;

  const initials = user?.fullname
    ? user.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav
      className={`sticky top-0 z-50 navbar-blur transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/Home" className="flex items-center gap-1 group">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#6A38C2] group-hover:text-[#8B5CF6] transition-colors">
                Job
              </span>
              <span className="text-[#F83002]">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="rounded-xl border-slate-200 hover:border-[#6A38C2] hover:text-[#6A38C2] font-medium">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-xl font-medium text-white" style={{ background: "linear-gradient(135deg, #6A38C2, #8B5CF6)" }}>
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors">
                    <Avatar className="h-9 w-9 ring-2 ring-[#6A38C2]/20">
                      <AvatarImage src={user?.profile?.profilePhoto} alt={user.fullname} />
                      <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white text-sm font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-slate-800 leading-none">
                        {user.fullname}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{user.role}</p>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 rounded-2xl overflow-hidden shadow-xl border border-slate-100" align="end">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#6A38C2]/5 to-[#8B5CF6]/5 border-b border-slate-100">
                    <Avatar className="h-12 w-12 ring-2 ring-[#6A38C2]/20">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                      <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-800">{user.fullname}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#6A38C2]/10 text-[#6A38C2] text-xs font-medium rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  {/* Menu Items */}
                  <div className="p-2">
                    {user.role !== "Recruiter" && (
                      <Link
                        to="/Profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors group"
                      >
                        <span className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-[#6A38C2]/10 transition-colors">
                          <User2 size={15} className="text-slate-500 group-hover:text-[#6A38C2]" />
                        </span>
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                    )}
                    {user.role !== "Recruiter" && (
                      <Link
                        to="/saved-jobs"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors group"
                      >
                        <span className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-[#6A38C2]/10 transition-colors">
                          <BookmarkCheck size={15} className="text-slate-500 group-hover:text-[#6A38C2]" />
                        </span>
                        <span className="text-sm font-medium">Saved Jobs</span>
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors group mt-1"
                    >
                      <span className="p-1.5 bg-red-50 rounded-lg">
                        <LogOut size={15} className="text-red-500" />
                      </span>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-[#6A38C2]/10 text-[#6A38C2]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {!user ? (
              <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">Login</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl text-white" style={{ background: "linear-gradient(135deg, #6A38C2, #8B5CF6)" }}>
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#6A38C2] text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.fullname}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logoutHandler} className="text-red-600 border-red-200 hover:bg-red-50">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
