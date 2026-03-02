import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentRes = await axios.get(
          "http://localhost:3000/api/assignments",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const submissionRes = await axios.get(
          "http://localhost:3000/api/submissions/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAssignments(assignmentRes.data);
        setSubmissions(submissionRes.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [token]);

  // 🔥 Dynamic Stats Calculation
  const total = assignments.length;

  const pending = submissions.filter(
    (s) => s.status === "PENDING"
  ).length;

  const approved = submissions.filter(
    (s) => s.status === "APPROVED"
  ).length;

  const rejected = submissions.filter(
    (s) => s.status === "REJECTED"
  ).length;

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-8">
        Track your assignments and submissions
      </p>

      {/* 🔥 Stats Section */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard title="TOTAL" value={total} color="indigo" />
        <StatCard title="PENDING" value={pending} color="yellow" />
        <StatCard title="APPROVED" value={approved} color="green" />
        <StatCard title="REJECTED" value={rejected} color="red" />
      </div>

      <h3 className="text-xl font-semibold mb-6">
        Your Assignments
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {assignments.map((assignment) => {
          const submission = submissions.find(
            (s) =>
              (typeof s.assignment === "object"
                ? s.assignment._id
                : s.assignment) === assignment._id
          );

          return (
            <div
              key={assignment._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-lg">
                  {assignment.title}
                </h4>

                {submission ? (
                  <StatusBadge status={submission.status} />
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-gray-200">
                    NOT SUBMITTED
                  </span>
                )}
              </div>

              <p className="text-gray-500 mb-2">
                {assignment.subject}
              </p>

              <p className="text-gray-500 mb-4">
                Due: {new Date(assignment.dueDate).toDateString()}
              </p>

              {submission && (
                <p className="text-sm text-indigo-600 mb-4">
                  {submission.file.split("\\").pop()}
                </p>
              )}

              <button
                onClick={() =>
                  submission
                    ? navigate(`/submission/${submission._id}`)
                    : navigate(`/assignment/${assignment._id}`)
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {submission ? "View Details →" : "Submit Assignment →"}
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export default StudentDashboard;


/* ---------- Small Components ---------- */

function StatCard({ title, value, color }) {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>

      <div className={`w-12 h-12 rounded-full ${colors[color]}`}></div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${style}`}>
      {status}
    </span>
  );
}