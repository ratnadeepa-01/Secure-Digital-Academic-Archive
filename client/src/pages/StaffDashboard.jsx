import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import {
  ClipboardList, Clock, CheckCircle, XCircle,
  Paperclip, Check, X, MessageSquare, AlertCircle,
  ChevronDown, ChevronUp,
} from "lucide-react";

function StaffDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("token");

  useEffect(() => { fetchSubmissions(); }, [token]);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/submissions/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch (err) { console.log(err); }
  };

  const handleReview = async (id, status, remarks) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/submissions/${id}`,
        { status, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status, remarks } : sub))
      );
    } catch { alert("Failed to review submission"); }
  };

  const total    = submissions.length;
  const pending  = submissions.filter((s) => s.status === "PENDING").length;
  const approved = submissions.filter((s) => s.status === "APPROVED").length;
  const rejected = submissions.filter((s) => s.status === "REJECTED").length;

  const filterTabs = ["All"];
  const assignmentCounts = { All: total };
  submissions.forEach((sub) => {
    const t = sub.assignment?.title;
    if (t) {
      if (!filterTabs.includes(t)) filterTabs.push(t);
      assignmentCounts[t] = (assignmentCounts[t] || 0) + 1;
    }
  });

  const filtered =
    filter === "All" ? submissions : submissions.filter((s) => s.assignment?.title === filter);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-theme tracking-tight">Staff Review Panel</h1>
        <p className="text-sm text-theme-2 mt-1">Review and evaluate student submissions below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard title="Total Received"  value={total}    variant="blue"   icon={ClipboardList} />
        <StatsCard title="Pending Review"  value={pending}  variant="orange" icon={Clock} />
        <StatsCard title="Approved"        value={approved} variant="green"  icon={CheckCircle} />
        <StatsCard title="Rejected"        value={rejected} variant="red"    icon={XCircle} />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              filter === tab
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-theme-card border-theme text-theme-2 hover:border-indigo-400 hover:text-theme"
            }`}
          >
            {tab}
            <span className={`ml-1.5 ${filter === tab ? "text-indigo-200" : "text-theme-3"}`}>
              ({assignmentCounts[tab]})
            </span>
          </button>
        ))}
      </div>

      {/* Submissions */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-theme-card border border-dashed border-theme rounded-2xl p-12 text-center">
            <AlertCircle size={36} className="text-theme-3 mx-auto mb-3" />
            <p className="text-sm text-theme-2">No submissions found for this filter.</p>
          </div>
        ) : (
          filtered.map((sub) => (
            <SubmissionRow key={sub._id} submission={sub} onReview={handleReview} />
          ))
        )}
      </div>
    </Layout>
  );
}

/* ─── Submission Row ──────────────────────────────────────── */
function SubmissionRow({ submission, onReview }) {
  const [remarks, setRemarks] = useState(submission.remarks || "");
  const [expanded, setExpanded] = useState(submission.status === "PENDING");

  const statusConfig = {
    PENDING: {
      label: "Pending",
      cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25",
      dot: "bg-amber-400",
    },
    APPROVED: {
      label: "Approved",
      cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    REJECTED: {
      label: "Rejected",
      cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/25",
      dot: "bg-red-400",
    },
  };

  const sc = statusConfig[submission.status] || statusConfig.PENDING;

  const submittedStr = new Date(submission.createdAt).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const legacyFileName = submission.file ? submission.file.split(/[\\\/]/).pop() : null;
  const initials = (submission.student?.name || "?")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="bg-theme-card border border-theme rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header row (always visible) */}
      <div
        className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-theme truncate">
                {submission.student?.name || "Unknown Student"}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${sc.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
            <p className="text-xs text-theme-3 mt-0.5 truncate">
              {submission.assignment?.title || "Untitled"} · {submittedStr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {(submission.files?.length > 0 || legacyFileName) && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-theme-2 bg-theme-bg px-2.5 py-1 rounded-lg border border-theme">
              <Paperclip size={12} />
              {submission.files?.length || 1} file{(submission.files?.length || 1) !== 1 ? "s" : ""}
            </span>
          )}
          {expanded ? <ChevronUp size={16} className="text-theme-3" /> : <ChevronDown size={16} className="text-theme-3" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-6 pb-6 pt-4 border-t border-theme flex flex-col xl:flex-row gap-6">
          {/* Left: meta + files */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetaChip label="Submitted On" value={submittedStr} />
              <MetaChip label="Version" value={`v${submission.version || 1}.0`} />
              <MetaChip label="Assignment" value={submission.assignment?.title || "—"} />
            </div>

            {(submission.files?.length > 0 || legacyFileName) && (
              <div>
                <p className="text-[11px] font-semibold text-theme-3 uppercase tracking-wider mb-2">
                  Attached Files
                </p>
                <div className="flex flex-wrap gap-2">
                  {submission.files?.length > 0
                    ? submission.files.map((f, i) => <FileBadge key={i} path={f.path} name={f.filename} />)
                    : legacyFileName && <FileBadge path={submission.file} name={legacyFileName} isLegacy />}
                </div>
              </div>
            )}
          </div>

          {/* Right: review */}
          <div className="w-full xl:w-72 flex flex-col gap-3">
            {submission.status === "PENDING" ? (
              <>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3.5 text-theme-3 pointer-events-none" />
                  <textarea
                    placeholder="Add review remarks…"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="input-field input-field-icon h-24 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReview(submission._id, "APPROVED", remarks)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => onReview(submission._id, "REJECTED", remarks)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-theme-bg rounded-xl p-4 border border-theme h-full">
                <p className="text-[11px] font-semibold text-theme-3 uppercase tracking-wider mb-2">Staff Feedback</p>
                <p className="text-sm text-theme-2 italic leading-relaxed">
                  "{submission.remarks || "No feedback provided."}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MetaChip ────────────────────────────────────────────── */
function MetaChip({ label, value }) {
  return (
    <div className="bg-theme-bg rounded-xl px-3 py-2.5 border border-theme">
      <p className="text-[10px] font-semibold text-theme-3 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-theme truncate">{value}</p>
    </div>
  );
}

/* ─── FileBadge ───────────────────────────────────────────── */
function FileBadge({ path, name, isLegacy = false }) {
  const fileName = name || (path && path.split(/[\\\/]/).pop()) || "Untitled";
  return (
    <a
      href={`http://localhost:3000/${path}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 px-3 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-300 hover:opacity-80 transition-opacity text-xs font-medium"
    >
      <Paperclip size={12} />
      <span className="max-w-[160px] truncate">{fileName}</span>
      {isLegacy && <span className="text-[9px] font-bold opacity-50 uppercase">Legacy</span>}
    </a>
  );
}

export default StaffDashboard;
