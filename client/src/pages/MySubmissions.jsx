import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  History, 
  ChevronRight,
  ClipboardList,
  Paperclip,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/submissions/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSubmissions();
  }, [token]);

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">My Submissions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Review your submission status and feedback history.</p>
      </div>

      <div className="space-y-6">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <div
              key={sub._id}
              className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-8 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500 flex-shrink-0 border border-primary-100 dark:border-primary-500/20 shadow-sm">
                <ClipboardList size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">
                    {sub.assignment?.title || "Unknown Assignment"}
                  </h3>
                  <StatusBadge status={sub.status} />
                </div>
                
                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-300" />
                    v{sub.version}.0
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-300" />
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  {sub.files?.length > 0 && (
                    <span className="flex items-center gap-1.5 text-primary-500">
                      <Paperclip size={14} />
                      {sub.files.length} {sub.files.length === 1 ? "File" : "Files"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => navigate(`/submission/${sub._id}`)}
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border text-xs font-black uppercase tracking-widest transition-all border border-gray-100 dark:border-dark-border"
                >
                  Details
                </button>
                <div className="hidden md:block p-2 rounded-xl group-hover:bg-primary-500 group-hover:text-white text-gray-300 transition-all duration-300">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200 dark:border-dark-border">
            <AlertCircle size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No submissions recorded yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

function StatusBadge({ status }) {
  const map = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
  };
  const label = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${map[status] || "bg-gray-100 text-gray-400 border-gray-200"}`}>
      {label[status] || status}
    </span>
  );
}

export default MySubmissions;
