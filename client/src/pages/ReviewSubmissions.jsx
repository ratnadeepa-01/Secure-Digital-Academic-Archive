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
      const res = await axios.patch(
        `http://localhost:3000/api/submissions/${submissionId}`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI without page reload
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId
            ? {
                ...sub,
                status: res.data.submission.status,
                remarks: remarks || "",
              }
            : sub
        )
      );

      alert("Updated successfully!");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">
        Student Submissions
      </h1>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((sub) => (
          <div
            key={sub._id}
            className="bg-white p-6 rounded shadow mb-4"
          >
            <p className="mb-2">
              <strong>Student:</strong> {sub.student.name}
            </p>

            {/* Status Badge */}
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  sub.status === "APPROVED"
                    ? "bg-green-500"
                    : sub.status === "REJECTED"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {sub.status}
              </span>
            </p>

            {/* Show Remarks if Exists */}
            {sub.remarks && (
              <p className="mb-2">
                <strong>Remarks:</strong> {sub.remarks}
              </p>
            )}

            <a
              href={`http://localhost:3000/${sub.file.replace(
                /\\/g,
                "/"
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline block mb-4"
            >
              View File
            </a>

            {/* Only show buttons if still pending */}
            {sub.status === "PENDING" && (
              <div className="space-x-4">
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
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewSubmissions;