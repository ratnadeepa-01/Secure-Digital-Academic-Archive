import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SubmissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/submissions/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const found = res.data.find((s) => s._id === id);
        setSubmission(found);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubmission();
  }, [id, token]);

  if (!submission)
    return <p className="p-8 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-4">
          {submission.assignment.title}
        </h2>

        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded text-white text-sm ${
              submission.status === "APPROVED"
                ? "bg-green-500"
                : submission.status === "REJECTED"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {submission.status}
          </span>
        </div>

        <p className="mb-2">
          <strong>Remarks:</strong>{" "}
          {submission.remarks || "No remarks"}
        </p>

        <a
          href={`http://localhost:3000/${submission.file.replace(/\\/g, "/")}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline block mb-6"
        >
          View Uploaded File
        </a>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SubmissionDetails;