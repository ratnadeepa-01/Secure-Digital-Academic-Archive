import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  Calendar,
  Upload,
  Paperclip,
  Loader2
} from "lucide-react";

function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [assignment, setAssignment] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [file, setFile] = useState(null);
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

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
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

        {existingSubmission ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-indigo-600">
              <Paperclip size={14} />
              {existingSubmission.file.split(/[\\/]/).pop()}
            </div>
            {existingSubmission.remarks && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
                <span className="font-medium">Remarks:</span> {existingSubmission.remarks}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
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
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Paperclip size={13} /> {file.name}
              </p>
            )}
            <button
              onClick={() => (file ? handleSubmit() : fileRef.current.click())}
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                <><Upload size={16} /> {file ? "Submit Assignment" : "Select File to Submit"}</>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AssignmentDetails;