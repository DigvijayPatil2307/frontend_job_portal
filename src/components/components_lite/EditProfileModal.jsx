import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import { Loader2, User, Mail, Phone, FileText, Sparkles, Camera } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null, // Reset file state for new selection
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <Sparkles size={24} /> Edit Profile
            </DialogTitle>
          </DialogHeader>
          <p className="text-purple-100 text-sm mt-1">Keep your profile updated for better opportunities</p>
        </div>

        <form onSubmit={submitHandler} className="p-8 bg-white">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-xs font-bold text-slate-500 uppercase">Full Name</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={changeEventHandler}
                    className="input-field pl-10 py-2.5"
                    placeholder="Full Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">Email</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="input-field pl-10 py-2.5"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-xs font-bold text-slate-500 uppercase">Phone</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={input.phoneNumber}
                    onChange={changeEventHandler}
                    className="input-field pl-10 py-2.5"
                    placeholder="Phone"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-bold text-slate-500 uppercase">Short Bio</Label>
                <input
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="input-field py-2.5"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-xs font-bold text-slate-500 uppercase">Skills (Comma separated)</Label>
              <input
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                className="input-field py-2.5"
                placeholder="React, Node.js, Python..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-xs font-bold text-slate-500 uppercase">Update Resume (PDF)</Label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="input-field pl-10 py-2 file:hidden text-slate-500 cursor-pointer"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#6A38C2] pointer-events-none">
                  CHOOSE FILE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic mt-1">Uploading a new resume will trigger automatic skill extraction.</p>
            </div>
          </div>

          <DialogFooter className="mt-10">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full btn-brand py-6 rounded-2xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
