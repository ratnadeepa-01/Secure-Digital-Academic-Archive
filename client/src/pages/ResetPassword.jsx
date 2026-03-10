import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Token is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg transition-colors duration-200">
      <div className="w-full max-w-md px-4">
        <div className="bg-theme-card border border-theme rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-theme mb-1">Set New Password</h1>
          <p className="text-sm text-theme-2 mb-7">
            Please enter your new password below.
          </p>

          {success ? (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-xl text-center">
              <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                Password reset successful!
              </p>
              <p className="text-xs text-theme-2">Redirecting you to login page...</p>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field input-field-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input-field input-field-icon"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-theme-2 hover:text-brand transition-colors inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
