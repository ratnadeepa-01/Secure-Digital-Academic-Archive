import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import SubmissionGraph from "../components/SubmissionGraph";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Paperclip,
  ArrowRight,
  Upload,
  AlertCircle,
  BookOpen
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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-theme mb-2 tracking-tight">Student Dashboard</h1>
        <p className="text-theme-2 text-sm font-medium">Welcome back! Here's an overview of your academic progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Assignments" value={total} variant="purple" icon={FileText} />
        <StatsCard title="Pending Review" value={pending} variant="blue" icon={Clock} />
        <StatsCard title="Approved" value={approved} variant="green" icon={CheckCircle} />
        <StatsCard title="Rejected" value={rejected} variant="orange" icon={XCircle} />
      </div>

      <SubmissionGraph />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-theme tracking-tight">Active Assignments</h2>
        <button className="text-brand text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
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
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-theme-card rounded-3xl border border-dashed border-theme">
            <AlertCircle size={40} className="text-theme-3 mb-2" />
            <p className="text-theme-2 font-medium">No assignments found</p>
          </div>
        )}
      </div>
    </Layout>
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
    <div className="bg-theme-card rounded-3xl border border-theme p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-brand-soft p-2.5 rounded-2xl text-brand">
          <BookOpen size={20} />
        </div>
        <StatusBadge status={submission ? submission.status : "NOT_SUBMITTED"} />
      </div>

      <div className="flex-1 min-w-0 mb-6">
        <h3 className="font-black text-theme text-base truncate mb-1 tracking-tight">{assignment.title}</h3>
        <p className="text-xs text-theme-3 font-bold uppercase tracking-tighter">{assignment.subject || "Academic Sub"}</p>
        <div className="mt-4 flex items-center gap-4 text-[11px] font-bold text-theme-2 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-theme-3" />
            {dueDateStr}
          </span>
          {fileName && (
            <span className="flex items-center gap-1.5 text-brand truncate max-w-[120px]">
              <Paperclip size={14} />
              Attached
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onAction}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black transition-all duration-200 tracking-tight ${submission
          ? "bg-theme-bg text-theme-2 hover:bg-theme-border-soft border border-theme"
          : "bg-brand text-white hover:bg-brand-hover shadow-lg shadow-indigo-500/20"
          }`}
      >
        {submission ? (
          <>View Submission <ArrowRight size={16} /></>
        ) : (
          <>
            <Upload size={16} />
            Submit Now
          </>
        )}
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-500/25",
    APPROVED: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25",
    REJECTED: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400 border-red-200 dark:border-red-500/25",
    NOT_SUBMITTED: "bg-theme-bg text-theme-2 border-theme",
  };
  const label = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    NOT_SUBMITTED: "Missing",
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${map[status] || map.NOT_SUBMITTED}`}>
      {label[status] || "Missing"}
    </span>
  );
}

export default StudentDashboard;
