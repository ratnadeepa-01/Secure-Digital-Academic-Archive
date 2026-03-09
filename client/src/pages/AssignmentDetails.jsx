import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  Calendar,
  Upload,
  Paperclip,
  Loader2,
  X,
  Check,
  BookOpen,
  Info,
  Clock,
  History,
  CheckCircle2,
  FileCheck2
} from "lucide-react";

function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [assignment, setAssignment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/assignments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/submissions/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAssignment(aRes.data);
        const sub = sRes.data.find(
          (s) =>
            (typeof s.assignment === "object" ? s.assignment._id : s.assignment) === id
        );
        setExistingSubmission(sub || null);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, token]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const newFiles = selectedFiles.filter(file => {
      if (!validTypes.includes(file.type)) {
        setErrorMsg(`Invalid file type: ${file.name}. Only JPEG, PNG, and PDF are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        setErrorMsg(`File too large: ${file.name}. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...newFiles]);
    setErrorMsg("");
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));

      await axios.post(
        `http://localhost:3000/api/submissions/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMsg("Assignment submitted successfully!");
      setFiles([]);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      </Layout>
    );
  }

  const dueDateStr = new Date(assignment.dueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const status = existingSubmission ? existingSubmission.status : "NOT_SUBMITTED";

  const statusStyles = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
    NOT_SUBMITTED: "bg-gray-100 dark:bg-dark-border text-gray-400 dark:text-gray-500 border-gray-200 dark:border-dark-border",
  };

  const statusLabel = {
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    NOT_SUBMITTED: "Not Submitted",
  };

  const getPreview = (file) => {
    if (file.type.startsWith("image/")) {
      return <img src={URL.createObjectURL(file)} className="w-10 h-10 object-cover rounded-xl" alt="preview" />;
    }
    return <Paperclip size={20} className="text-gray-400" />;
  };

  return (
    <Layout>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary-500 mb-8 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Left: Assignment Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{assignment.title}</h1>
                <p className="text-xs font-black text-primary-500 uppercase tracking-widest">{assignment.subject || "Academic Assignment"}</p>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border shadow-sm ${statusStyles[status]}`}>
                {statusLabel[status]}
              </span>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-dark-bg text-gray-400">
                    <Calendar size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Due Date</p>
                    <p className="text-sm font-black text-gray-700 dark:text-gray-300 tracking-tight">{dueDateStr}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-dark-bg text-gray-400">
                    <Clock size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-black text-gray-700 dark:text-gray-300 tracking-tight">{status === "NOT_SUBMITTED" ? "Awaiting Submission" : "Active"}</p>
                 </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-primary-500" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Topic Description</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-medium">{assignment.description || "No description provided."}</p>
            </div>

            {existingSubmission && (
              <div className="bg-gray-50 dark:bg-dark-bg/50 rounded-3xl p-6 border border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck2 size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Active Submission (v{existingSubmission.version}.0)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 uppercase tracking-widest">
                  {existingSubmission.files?.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-500">
                           <Paperclip size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-700 dark:text-gray-300 truncate">{f.filename || "Submission File"}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{formatSize(f.size)}</p>
                        </div>
                      </div>
                      <a href={`http://localhost:3000/${f.path}`} target="_blank" rel="noreferrer" className="text-xs font-black text-primary-500 hover:underline">VIEW</a>
                    </div>
                  ))}
                </div>
                {existingSubmission.remarks && (
                  <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm italic font-medium">
                     <span className="font-black uppercase tracking-widest text-[10px] block mb-1">Feedback from Staff</span>
                     "{existingSubmission.remarks}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Version History */}
          {existingSubmission?.history?.length > 0 && (
            <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <History size={18} className="text-gray-400" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Revision History</h3>
              </div>
              <div className="space-y-6">
                {existingSubmission.history.map((h, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-dark-border group-first:bg-primary-500 mt-1.5 shadow-sm" />
                      <div className="w-px flex-1 bg-gray-100 dark:bg-dark-border group-last:hidden" />
                    </div>
                    <div className="flex-1 pb-6 border-b border-gray-50 dark:border-dark-border group-last:border-none">
                      <div className="flex items-center justify-between mb-2">
                         <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">Version v{h.version}.0</h4>
                         <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${statusStyles[h.status]}`}>{h.status}</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{new Date(h.updatedAt).toLocaleString()}</p>
                      {h.remarks && <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3">"{h.remarks}"</p>}
                      <div className="flex flex-wrap gap-2">
                        {h.files.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border px-3 py-1.5 rounded-xl text-gray-500 dark:text-gray-400">
                             <Paperclip size={10} /> {f.filename || "File"}
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

        {/* Right: Submission Action */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm sticky top-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 tracking-tight">
              {existingSubmission ? "Revision Sub" : "Upload Work"}
            </h3>
            <p className="text-xs font-medium text-gray-400 mb-6">Select your assignment files to proceed.</p>

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-black uppercase tracking-widest text-center">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-black uppercase tracking-widest text-center">
                {errorMsg}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="space-y-3 mb-6">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-primary-50/30 dark:bg-primary-900/10 p-4 rounded-2xl border border-primary-100 dark:border-primary-500/20 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden flex items-center justify-center">
                      {getPreview(file)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(idx)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 rounded-xl transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => fileRef.current.click()}
                className="w-full bg-gray-50 dark:bg-dark-bg border border-dashed border-gray-200 dark:border-dark-border hover:border-primary-500/50 hover:bg-primary-50/20 dark:hover:bg-primary-900/10 text-gray-400 hover:text-primary-500 py-8 rounded-3xl text-sm font-black flex flex-col items-center justify-center gap-3 transition-all"
              >
                <div className="w-12 h-12 bg-white dark:bg-dark-card rounded-2xl shadow-sm flex items-center justify-center text-primary-500">
                  <Upload size={24} />
                </div>
                <div>
                   <span className="block mb-1">Select Files</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest block opacity-60">PDF, JPG, PNG up to 5MB</span>
                </div>
              </button>

              {files.length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-500/30 mt-4"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Uplodaing...</>
                  ) : (
                    <>
                      <FileCheck2 size={18} />
                      Submit {files.length} {files.length === 1 ? "File" : "Files"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AssignmentDetails;
ntDetails;