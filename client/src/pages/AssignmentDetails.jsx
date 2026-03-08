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
  Check
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
          <Loader2 className="animate-spin text-indigo-500" size={28} />
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
    PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
    APPROVED: "bg-green-50 text-green-600 border border-green-200",
    REJECTED: "bg-red-50 text-red-500 border border-red-200",
    NOT_SUBMITTED: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  const statusLabel = {
    PENDING: "● PENDING",
    APPROVED: "● APPROVED",
    REJECTED: "● REJECTED",
    NOT_SUBMITTED: "● NOT SUBMITTED",
  };

  const getPreview = (file) => {
    if (file.type.startsWith("image/")) {
      return <img src={URL.createObjectURL(file)} className="w-10 h-10 object-cover rounded" alt="preview" />;
    }
    return <Paperclip size={20} className="text-gray-400" />;
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
          <h1 className="text-xl font-bold text-gray-900">{assignment.title}</h1>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[status]}`}>
            {statusLabel[status]}
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-6">{assignment.subject}</p>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</p>
          <p className="text-gray-700 text-sm leading-relaxed">{assignment.description}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Calendar size={15} className="text-gray-400" />
          Due: {dueDateStr}
        </div>

        <div className="space-y-6">
          {existingSubmission && (
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <h3 className="text-sm font-bold text-gray-900">Current Submission (v{existingSubmission.version})</h3>
              <div className="grid gap-2">
                {existingSubmission.files && existingSubmission.files.length > 0 ? (
                  existingSubmission.files.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-500">
                          {f.mimetype && f.mimetype.startsWith("image/") ? (
                            <img src={`http://localhost:3000/${f.path}`} className="w-10 h-10 object-cover rounded" alt="sub-preview" />
                          ) : (
                            <Paperclip size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{f.filename || (f.path && f.path.split(/[\\/]/).pop()) || "Unknown File"}</p>
                          <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:3000/${f.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : existingSubmission.file ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-500">
                        <Paperclip size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{existingSubmission.file.split(/[\\/]/).pop()}</p>
                      </div>
                    </div>
                    <a
                      href={`http://localhost:3000/${existingSubmission.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View
                    </a>
                  </div>
                ) : null}
              </div>
              {existingSubmission.remarks && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-sm text-amber-700">
                  <span className="font-bold">Staff Remarks:</span> {existingSubmission.remarks}
                </div>
              )}
            </div>
          )}

          {/* New Submission Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              {existingSubmission ? "Revision / Resubmit" : "Submit Your Work"}
            </h3>

            {successMsg && (
              <div className="px-4 py-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
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

            <div className="grid gap-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-indigo-50/30 p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded shadow-sm overflow-hidden flex items-center justify-center">
                      {getPreview(file)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(idx)} className="p-1 hover:bg-red-50 text-red-400 rounded transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fileRef.current.click()}
                className="flex-1 border-2 border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 py-6 rounded-xl text-sm font-medium flex flex-col items-center justify-center gap-2 transition-all"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-100">
                  <Upload size={20} />
                </div>
                <span>Select Files</span>
                <span className="text-[10px] opacity-70">(PDF, JPEG, PNG up to 5MB)</span>
              </button>

              {files.length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-1/3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold flex flex-col items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-100"
                >
                  {submitting ? (
                    <><Loader2 size={24} className="animate-spin" /> Submitting…</>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Check size={20} />
                      </div>
                      Upload {files.length} {files.length === 1 ? "File" : "Files"}
                    </>
                  )}
                </button>
              )}
            </div>

            {existingSubmission?.history?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Version History</h3>
                <div className="space-y-4">
                  {existingSubmission.history.map((h, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300 group-last:bg-gray-200 mt-1.5" />
                        <div className="w-px flex-1 bg-gray-200 group-last:hidden" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-700">Version {h.version}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[h.status]}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(h.updatedAt).toLocaleString()}
                        </p>
                        {h.remarks && (
                          <p className="text-xs bg-gray-50 p-2 rounded text-gray-600 mb-2 italic">
                            "{h.remarks}"
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {h.files.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">
                              <Paperclip size={10} /> {f.filename || (f.path && f.path.split(/[\\/]/).pop()) || "Unknown"}
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
      </div>
    </Layout>
  );
}


export default AssignmentDetails;