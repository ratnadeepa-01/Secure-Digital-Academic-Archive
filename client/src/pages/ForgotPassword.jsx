import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg transition-colors duration-200">
      <div className="w-full max-w-md px-4">
        <div className="bg-theme-card border border-theme rounded-2xl shadow-sm p-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-theme-2 hover:text-brand mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <h1 className="text-2xl font-bold text-theme mb-1">Forgot Password</h1>
          <p className="text-sm text-theme-2 mb-7">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message ? (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-xl text-center">
              <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none" />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
