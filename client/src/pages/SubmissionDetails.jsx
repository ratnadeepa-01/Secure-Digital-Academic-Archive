import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  Calendar,
  Paperclip,
  Loader2,
  User
} from "lucide-react";

function SubmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/submissions/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmission(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, token]);

  if (!submission) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={28} />
        </div>
      </Layout>
    );
  }

  const assignment =
    typeof submission.assignment === "object" ? submission.assignment : {};

  const dueDateStr = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "";

  const submittedStr = new Date(submission.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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

  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Layout>
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-xl font-bold text-gray-900">
            {assignment.title || "Assignment"}
          </h1>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[submission.status] || "bg-gray-100 text-gray-500"
              }`}
          >
            {statusLabel[submission.status] || submission.status}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">{assignment.subject}</p>

        <div className="space-y-6 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User size={14} className="text-gray-400" />
              {submittedStr}
            </span>
            <span>Version: {submission.version}</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted Files</p>
            <div className="grid gap-2">
              {submission.files && submission.files.length > 0 ? (
                submission.files.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-gray-200">
                        {f.mimetype && f.mimetype.startsWith("image/") ? (
                          <img src={`http://localhost:3000/${f.path}`} className="w-full h-full object-cover rounded" alt="preview" />
                        ) : (
                          <Paperclip size={18} className="text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate">{f.filename || (f.path && f.path.split(/[\\/]/).pop()) || "Unknown File"}</p>
                        <p className="text-[10px] text-gray-400">{formatSize(f.size)}</p>
                      </div>
                    </div>
                    <a
                      href={`http://localhost:3000/${f.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))
              ) : submission.file ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-gray-200">
                      <Paperclip size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate">{submission.file.split(/[\\/]/).pop()}</p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:3000/${submission.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No files provided!</div>
              )}
            </div>
          </div>

          {submission.remarks && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">
                Staff Remarks
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">{submission.remarks}</p>
            </div>
          )}

          {submission.history?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Past Versions</p>
              <div className="space-y-4">
                {submission.history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-0.5 bg-gray-100 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">v{h.version}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[h.status] || "bg-gray-100"}`}>
                          {h.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-2">{new Date(h.updatedAt).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2">
                        {h.files.map((f, fi) => (
                          <div key={fi} className="text-[9px] bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                            {f.filename || (f.path && f.path.split(/[\\/]/).pop()) || "Unknown"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SubmissionDetails;