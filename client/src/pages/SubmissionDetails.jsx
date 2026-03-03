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

  const fileName = submission.file.split(/[\\/]/).pop();
  const fileUrl = `http://localhost:3000/uploads/${fileName}`;

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

        <div className="space-y-4 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={15} className="text-gray-400" />
            Submitted: {submittedStr}
          </div>
          {dueDateStr && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={15} className="text-gray-400" />
              Due: {dueDateStr}
            </div>
          )}
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-indigo-500 hover:underline"
          >
            <Paperclip size={14} />
            {fileName}
          </a>
          {submission.remarks && (
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Staff Remarks
              </p>
              <p className="text-sm text-gray-700">{submission.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SubmissionDetails;