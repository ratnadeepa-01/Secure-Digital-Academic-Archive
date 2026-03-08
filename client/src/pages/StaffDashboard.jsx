import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { ClipboardList, Clock, CheckCircle, XCircle, User, Paperclip, Check, X } from "lucide-react";

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
      // Update local state to reflect change instantly
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

  // Get unique assignments for filter tabs
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Review Dashboard</h1>
      <p className="text-gray-500 text-sm mb-7">Review and manage student submissions</p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL" value={total} icon={<ClipboardList size={20} />} iconBg="bg-blue-50" iconColor="text-blue-500" />
        <StatCard title="PENDING" value={pending} icon={<Clock size={20} />} iconBg="bg-amber-50" iconColor="text-amber-500" />
        <StatCard title="APPROVED" value={approved} icon={<CheckCircle size={20} />} iconBg="bg-green-50" iconColor="text-green-500" />
        <StatCard title="REJECTED" value={rejected} icon={<XCircle size={20} />} iconBg="bg-gray-100" iconColor="text-gray-500" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === tab
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {tab} <span className="opacity-70 ml-1">({assignmentCounts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
            No submissions found for this filter.
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

function StatCard({ title, value, icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-full ${iconBg} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function SubmissionRow({ submission, onReview }) {
  const [remarks, setRemarks] = useState(submission.remarks || "");

  const statusStyles = {
    PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
    APPROVED: "bg-green-50 text-green-600 border border-green-200",
    REJECTED: "bg-red-50 text-red-500 border border-red-200",
  };
  const statusLabel = {
    PENDING: "● PENDING",
    APPROVED: "● APPROVED",
    REJECTED: "● REJECTED",
  };

  const submittedStr = new Date(submission.createdAt).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false
  });

  const legacyFileStr = submission.file;
  const legacyFileName = legacyFileStr ? legacyFileStr.split(/[\\/]/).pop() : null;
  const legacyFileUrl = legacyFileName ? `http://localhost:3000/${legacyFileStr}` : "#";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6">
      {/* Left Info */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-sm">
            <User size={16} className="text-gray-400" />
            {submission.student?.name || "Unknown Student"}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[submission.status]}`}>
            {statusLabel[submission.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{submission.assignment?.title}</p>

        <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
          <span>Submitted: {submittedStr}</span>
          <span>Version: {submission.version}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {submission.files && submission.files.length > 0 ? (
            submission.files.map((f, i) => (
              <a
                key={i}
                href={`http://localhost:3000/${f.path}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <Paperclip size={12} />
                <span className="max-w-[120px] truncate">{f.filename || (f.path && f.path.split(/[\\/]/).pop()) || "Unknown File"}</span>
              </a>
            ))
          ) : legacyFileName ? (
            <a
              href={legacyFileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <Paperclip size={12} />
              <span className="max-w-[120px] truncate">{legacyFileName}</span>
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic">No files provided</span>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="w-full md:w-72 flex flex-col gap-3">
        {submission.status === "PENDING" ? (
          <>
            <textarea
              placeholder="Add remarks (optional)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-20 text-sm p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => onReview(submission._id, "APPROVED", remarks)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => onReview(submission._id, "REJECTED", remarks)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-200 h-full flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase mb-1">Remarks</span>
            <p className="text-gray-700 flex-1">{submission.remarks || "No remarks provided"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;