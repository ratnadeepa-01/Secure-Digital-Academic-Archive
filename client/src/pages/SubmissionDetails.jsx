import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SubmissionDetails() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmission = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/submissions/my`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const found = res.data.find(s => s._id === id);
      setSubmission(found);
    };

    fetchSubmission();
  }, [id, token]);

  if (!submission) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        {submission.assignment.title}
      </h2>

      <p>Status: {submission.status}</p>
      <p>Remarks: {submission.remarks || "No remarks"}</p>

      <a
        href={`http://localhost:3000/${submission.file}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        View Uploaded File
      </a>
    </div>
  );
}

export default SubmissionDetails;