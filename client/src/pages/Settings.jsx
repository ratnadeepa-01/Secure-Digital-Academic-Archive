import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { User, Lock, Moon, Sun, CheckCircle2, AlertCircle, Save } from "lucide-react";

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
  });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password State
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/auth/profile",
        { name: profileData.name, email: profileData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    }
  };

  // Handle Password Strategy
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassMsg({ type: "", text: "" });
    
    if (passData.newPassword !== passData.confirmPassword) {
      return setPassMsg({ type: "error", text: "New passwords do not match." });
    }

    try {
      await axios.patch(
        "http://localhost:3000/api/auth/change-password",
        { 
          currentPassword: passData.currentPassword,
          newPassword: passData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPassMsg({ type: "success", text: "Password changed successfully!" });
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    }
  };

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-theme mb-2 tracking-tight">Account Settings</h1>
        <p className="text-theme-2 text-sm font-medium">Manage your personal information, security preferences, and app settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Left Column: Profile & Prefs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Card */}
          <div className="bg-theme-card border border-theme rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-brand-soft text-brand">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-theme tracking-tight">Profile Information</h2>
            </div>

            {profileMsg.text && (
              <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 ${
                profileMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                  : "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
              }`}>
                {profileMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">Account Role</label>
                <div className="input-field bg-theme-bg text-theme-3 opacity-70 cursor-not-allowed capitalize">
                  {profileData.role}
                </div>
                <p className="text-[10px] text-theme-3 mt-1 pl-1">Your role is assigned by administrators and cannot be changed.</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Card */}
          <div className="bg-theme-card border border-theme rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <h2 className="text-xl font-bold text-theme tracking-tight">App Preferences</h2>
            </div>
            
            <div className="flex items-center justify-between p-5 rounded-2xl bg-theme-bg border border-theme">
              <div>
                <p className="font-semibold text-theme text-sm">Appearance</p>
                <p className="text-xs text-theme-2 mt-1">Switch between light and dark mode.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="px-5 py-2.5 rounded-xl bg-theme-card border border-theme text-theme text-xs font-bold shadow-sm hover:border-brand hover:text-brand transition-colors flex items-center gap-2"
              >
                {theme === "light" ? <><Moon size={14}/> Dark Mode</> : <><Sun size={14}/> Light Mode</>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security */}
        <div className="space-y-8">
          <div className="bg-theme-card border border-theme rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold text-theme tracking-tight">Security</h2>
            </div>

            {passMsg.text && (
              <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 ${
                passMsg.type === "success" 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                  : "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
              }`}>
                {passMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {passMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">Current Password</label>
                <input 
                  type="password" 
                  value={passData.currentPassword}
                  onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">New Password</label>
                <input 
                  type="password" 
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-theme-3 uppercase tracking-widest pl-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passData.confirmPassword}
                  onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                  className="input-field"
                  required
                  minLength={6}
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2">
                  <Lock size={16} />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Settings;
