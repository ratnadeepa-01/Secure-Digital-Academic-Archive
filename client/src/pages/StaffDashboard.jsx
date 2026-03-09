import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Paperclip, 
  Check, 
  X,
  Search,
  ChevronRight,
  MessageSquare,
  AlertCircle
} from "lucide-react";

function StaffDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/submissions/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReview = async (id, status, remarks) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/submissions/${id}`,
        { status, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status, remarks } : sub
        )
      );
    } catch (err) {
      alert("Failed to review submission");
    }
  };

  const total = submissions.length;
  const pending = submissions.filter((s) => s.status === "PENDING").length;
  const approved = submissions.filter((s) => s.status === "APPROVED").length;
  const rejected = submissions.filter((s) => s.status === "REJECTED").length;

  const filterTabs = ["All"];
  const assignmentCounts = { All: total };

  submissions.forEach((sub) => {
    const title = sub.assignment?.title;
    if (title) {
      if (!filterTabs.includes(title)) filterTabs.push(title);
      assignmentCounts[title] = (assignmentCounts[title] || 0) + 1;
    }
  });

  const filteredSubmissions =
    filter === "All"
      ? submissions
      : submissions.filter((s) => s.assignment?.title === filter);

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Staff Review</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Manage and evaluate student academic progress.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Received" value={total} variant="blue" icon={ClipboardList} />
        <StatsCard title="Pending Review" value={pending} variant="orange" icon={Clock} />
        <StatsCard title="Approved" value={approved} variant="green" icon={CheckCircle} />
        <StatsCard title="Rejected" value={rejected} variant="purple" icon={XCircle} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 border ${filter === tab
                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                : "bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border text-gray-400 dark:text-gray-500 hover:border-primary-500/30"
                }`}
            >
              {tab} <span className={`ml-1.5 opacity-60 ${filter === tab ? "text-white" : "text-primary-500"}`}>({assignmentCounts[tab]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-100 dark:border-dark-border p-12 text-center shadow-sm">
            <AlertCircle size={40} className="text-gray-300 dark:text-dark-border mx-auto mb-3" />
            <p className="text-gray-400 font-medium tracking-tight">No submissions found for this filter.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => (
            <SubmissionRow key={sub._id} submission={sub} onReview={handleReview} />
          ))
        )}
      </div>
    </Layout>
  );
}

function SubmissionRow({ submission, onReview }) {
  const [remarks, setRemarks] = useState(submission.remarks || "");

  const statusStyles = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
  };

  const submittedStr = new Date(submission.createdAt).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  const legacyFileStr = submission.file;
  const legacyFileName = legacyFileStr ? legacyFileStr.split(/[\\/]/).pop() : null;

  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col xl:flex-row gap-8">
      {/* Left Info */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border flex items-center justify-center text-primary-500 text-lg font-black">
            {submission.student?.name?.[0] || "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 dark:text-white font-black tracking-tight">{submission.student?.name || "Unknown"}</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${statusStyles[submission.status]}`}>
                {submission.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1">{submission.assignment?.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-dark-bg/50 p-3 rounded-2xl border border-gray-100/50 dark:border-dark-border/50">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted On</p>
             <p className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">{submittedStr}</p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-bg/50 p-3 rounded-2xl border border-gray-100/50 dark:border-dark-border/50">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Version</p>
             <p className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">v{submission.version}.0</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {submission.files?.length > 0 ? (
            submission.files.map((f, i) => (
              <FileBadge key={i} path={f.path} name={f.filename} />
            ))
          ) : legacyFileName && (
            <FileBadge path={submission.file} name={legacyFileName} isLegacy />
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="w-full xl:w-80 flex flex-col gap-4">
        {submission.status === "PENDING" ? (
          <>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                placeholder="Review remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-24 text-sm font-medium p-4 pl-11 border border-gray-100 dark:border-dark-border rounded-3xl bg-gray-50 dark:bg-dark-bg focus:ring-2 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-dark-card transition-all resize-none dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onReview(submission._id, "APPROVED", remarks)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => onReview(submission._id, "REJECTED", remarks)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 dark:bg-dark-bg rounded-3xl p-5 border border-gray-100 dark:border-dark-border h-full">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Staff Feedback</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic tracking-tight">"{submission.remarks || "No feedback provided."}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FileBadge({ path, name, isLegacy = false }) {
  const fileName = name || (path && path.split(/[\\/]/).pop()) || "Untitled";
  return (
    <a
      href={`http://localhost:3000/${path}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100/50 dark:border-primary-500/20 px-4 py-2.5 rounded-2xl text-primary-600 dark:text-primary-400 hover:bg-primary-50 transition-all font-bold text-xs tracking-tight"
    >
      <Paperclip size={14} />
      <span className="max-w-[140px] truncate">{fileName}</span>
      {isLegacy && <span className="opacity-40 text-[9px] uppercase tracking-tighter">(Legacy)</span>}
    </a>
  );
}

export default StaffDashboard;
board;