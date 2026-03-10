import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { PlusCircle, Loader2 } from "lucide-react";

function CreateAssignment() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:3000/api/assignments",
        { title, subject, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/staff");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-theme mb-1">Create Assignment</h1>
        <p className="text-sm text-theme-2 mb-7">Add a new assignment for students</p>

        <form onSubmit={submitHandler} className="bg-theme-card border border-theme rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-theme-2 mb-1.5">Assignment Title</label>
              <input
                type="text"
                placeholder="e.g. Data Structures Lab Report"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="input-field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-2 mb-1.5">Due Date</label>
                <input
                  type="date"
                  className="input-field dark:[color-scheme:dark]"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-2 mb-1.5">Description &amp; Instructions</label>
              <textarea
                placeholder="Provide detailed instructions for this assignment..."
                className="input-field h-32 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/staff")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-theme-2 hover:bg-theme-border-soft transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : <><PlusCircle size={16} /> Create Assignment</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default CreateAssignment;
