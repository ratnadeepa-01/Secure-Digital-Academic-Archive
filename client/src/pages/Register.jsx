import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Users, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/register", { name, email, password, role });
      const loginRes = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role", loginRes.data.user.role);
      localStorage.setItem("name", loginRes.data.user.name);
      localStorage.setItem("email", loginRes.data.user.email);
      loginRes.data.user.role === "staff" ? navigate("/staff") : navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg transition-colors duration-200">
      {/* Theme toggle top-right */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-theme-card border border-theme text-theme-2 hover:text-theme hover:bg-theme-border-soft transition-all"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              S
            </div>
            <div>
              <p className="font-bold text-theme text-base leading-tight">SDAA</p>
              <p className="text-xs text-theme-2 leading-tight">Digital Academic Archive</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-theme-card border border-theme rounded-2xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-theme mb-1">Create account</h1>
            <p className="text-sm text-theme-2 mb-7">Join the digital academic archive</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Full name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Dr. Meera Sharma"
                    className="input-field input-field-icon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@university.edu"
                    className="input-field input-field-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field input-field-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role select */}
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Role</label>
                <div className="relative">
                  <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <select
                    className="input-field input-field-icon appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2 shadow-sm"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-theme-2">
              Already have an account?{" "}
              <Link to="/" className="text-brand font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;