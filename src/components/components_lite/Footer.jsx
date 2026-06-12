import React from "react";
import { Link } from "react-router-dom";
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1 mb-6">
              <span className="text-2xl font-black tracking-tight text-white">
                Job<span className="text-[#F83002]">Portal</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              India's premier platform for career growth. We connect top talent with the most innovative companies to shape the future of work.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-[#6A38C2] hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              Quick Links <div className="h-1 w-4 bg-[#6A38C2] rounded-full" />
            </h4>
            <ul className="space-y-4">
              {["Home", "Jobs", "Browse", "About Us"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.replace(" ", "")}`} className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#6A38C2]" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              Job Roles <div className="h-1 w-4 bg-[#F83002] rounded-full" />
            </h4>
            <ul className="space-y-4">
              {["Frontend Developer", "Backend Developer", "UI/UX Designer", "Data Scientist"].map((role) => (
                <li key={role}>
                  <Link to="/Browse" className="text-sm hover:text-white transition-colors">{role}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              Contact Us <div className="h-1 w-4 bg-blue-500 rounded-full" />
            </h4>
            <ul className="space-y-5">
              <li className="flex gap-3 text-sm">
                <MapPin size={18} className="text-[#6A38C2] shrink-0" />
                <span>TKIET, Warananagar, Kolhapur, Maharashtra 416113</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-[#F83002] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>contact@jobportal.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© {currentYear} Job Portal. Built with ❤️ in India.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
