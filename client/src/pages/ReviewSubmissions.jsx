import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ReviewSubmissions() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/submissions/assignment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubmissions();
  }, [id, token]);

  const updateStatus = async (submissionId, status) => {
    const remarks = prompt("Enter remarks:");

    try {
      await axios.patch(
        `http://localhost:3000/api/submissions/${submissionId}`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Updated successfully!");
      window.location.reload();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">
        Student Submissions
      </h1>

      {submissions.map((sub) => (
        <div
          key={sub._id}
          className="bg-white p-6 rounded shadow mb-4"
        >
          <p>
            <strong>Student:</strong> {sub.student.name}
          </p>

          <p>
            <strong>Status:</strong> {sub.status}
          </p>

          <a
            href={`http://localhost:3000/${sub.file.replace(/\\/g, "/")}`}            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View File
          </a>

          <div className="mt-4 space-x-4">
            <button
              onClick={() =>
                updateStatus(sub._id, "APPROVED")
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() =>
                updateStatus(sub._id, "REJECTED")
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewSubmissions;