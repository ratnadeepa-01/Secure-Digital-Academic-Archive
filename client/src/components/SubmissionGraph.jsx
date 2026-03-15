import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Users, FileCheck2, AlertCircle } from "lucide-react";

function SubmissionGraph() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/assignments/stats/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch assignment stats:", err);
        setError("Could not load submission statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-theme-card border border-theme rounded-3xl p-8 mb-8 animate-pulse">
        <div className="h-6 w-48 bg-theme-bg rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-theme-bg rounded w-full"></div>
          <div className="h-4 bg-theme-bg rounded w-full"></div>
          <div className="h-4 bg-theme-bg rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-theme-card border border-dashed border-red-300 dark:border-red-500/30 rounded-3xl p-6 mb-8 flex items-center gap-3 text-red-500">
        <AlertCircle size={20} />
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  // Calculate overall completion rate across all assignments
  const totalPossibleSubmissions = stats.reduce((acc, curr) => acc + curr.totalStudents, 0);
  const totalActualSubmissions = stats.reduce((acc, curr) => acc + curr.submittedCount, 0);
  const overallPercentage = totalPossibleSubmissions === 0 ? 0 : Math.round((totalActualSubmissions / totalPossibleSubmissions) * 100);

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={20} className="text-brand" />
            <h2 className="text-lg font-black text-theme tracking-tight">Submission Overview</h2>
          </div>
          <p className="text-xs font-semibold text-theme-3 uppercase tracking-widest">
            Completion rates across all active assignments
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-theme-bg px-4 py-3 rounded-2xl border border-theme">
          <div className="text-center">
            <p className="text-[10px] font-black text-theme-3 uppercase tracking-widest mb-0.5">Overall Rate</p>
            <p className="text-xl font-black text-brand tracking-tighter">{overallPercentage}%</p>
          </div>
          <div className="w-px h-8 bg-theme-border"></div>
          <div className="text-center">
            <p className="text-[10px] font-black text-theme-3 uppercase tracking-widest mb-0.5">Total Subs</p>
            <p className="text-xl font-black text-theme tracking-tighter">{totalActualSubmissions}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {stats.map((stat) => {
          const percentage = stat.totalStudents === 0 ? 0 : Math.round((stat.submittedCount / stat.totalStudents) * 100);
          
          return (
            <div key={stat._id} className="group">
              <div className="flex items-end justify-between mb-2">
                <div className="min-w-0 pr-4">
                  <h3 className="text-sm font-bold text-theme truncate mb-1">{stat.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-theme-3 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {stat.totalStudents} Students
                    </span>
                    <span className="flex items-center gap-1 text-emerald-500">
                      <FileCheck2 size={12} /> {stat.submittedCount} Submitted
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-black text-theme tracking-tighter">{percentage}%</span>
                </div>
              </div>
              
              <div className="h-3 w-full bg-theme-bg rounded-full overflow-hidden border border-theme relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand to-indigo-400 dark:from-indigo-500 dark:to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubmissionGraph;
