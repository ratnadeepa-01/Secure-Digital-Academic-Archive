import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Paperclip,
  ArrowRight,
  Upload
} from "lucide-react";

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          axios.get("http://localhost:3000/api/assignments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/submissions/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAssignments(assignmentRes.data);
        setSubmissions(submissionRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  const total = assignments.length;
  const pending = submissions.filter((s) => s.status === "PENDING").length;
  const approved = submissions.filter((s) => s.status === "APPROVED").length;
  const rejected = submissions.filter((s) => s.status === "REJECTED").length;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-7">Track your assignments and submissions</p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL" value={total} icon={<FileText size={20} />} iconBg="bg-indigo-50" iconColor="text-indigo-500" />
        <StatCard title="PENDING" value={pending} icon={<Clock size={20} />} iconBg="bg-amber-50" iconColor="text-amber-500" />
        <StatCard title="APPROVED" value={approved} icon={<CheckCircle size={20} />} iconBg="bg-green-50" iconColor="text-green-500" />
        <StatCard title="REJECTED" value={rejected} icon={<XCircle size={20} />} iconBg="bg-red-50" iconColor="text-red-400" />
      </div>

      <h2 className="text-base font-semibold text-gray-900 mb-4">Your Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment) => {
          const submission = submissions.find(
            (s) =>
              (typeof s.assignment === "object"
                ? s.assignment._id
                : s.assignment) === assignment._id
          );

          return (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              submission={submission}
              onAction={() =>
                submission
                  ? navigate(`/submission/${submission._id}`)
                  : navigate(`/assignment/${assignment._id}`)
              }
            />
          );
        })}
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

function AssignmentCard({ assignment, submission, onAction }) {
  const legacyFile = submission?.file;
  const fileName = submission?.files?.[0]?.filename || (submission?.files?.[0]?.path && submission.files[0].path.split(/[\\/]/).pop()) || (legacyFile ? legacyFile.split(/[\\/]/).pop() : null);

  const dueDateStr = new Date(assignment.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{assignment.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{assignment.subject}</p>
        </div>
        <StatusBadge status={submission ? submission.status : "NOT_SUBMITTED"} />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={13} className="text-gray-400" />
          Due: {dueDateStr}
        </span>
        {fileName && (
          <span className="flex items-center gap-1 text-indigo-500 truncate max-w-[140px]">
            <Paperclip size={13} />
            {fileName}
          </span>
        )}
      </div>

      <button
        onClick={onAction}
        className={`flex items-center gap-2 self-start px-4 py-2 rounded-lg text-sm font-medium transition-colors ${submission
            ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {submission ? (
          <>View Details <ArrowRight size={14} /></>
        ) : (
          <>
            <Upload size={14} />
            Submit Assignment <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
    APPROVED: "bg-green-50 text-green-600 border border-green-200",
    REJECTED: "bg-red-50 text-red-500 border border-red-200",
    NOT_SUBMITTED: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  const label = {
    PENDING: "● PENDING",
    APPROVED: "● APPROVED",
    REJECTED: "● REJECTED",
    NOT_SUBMITTED: "● NOT SUBMITTED",
  };

  return (
    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || map.NOT_SUBMITTED}`}>
      {label[status] || "● NOT SUBMITTED"}
    </span>
  );
}

export default StudentDashboard;