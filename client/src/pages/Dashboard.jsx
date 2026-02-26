import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAssignments();
  }, [token]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">SDAA</h2>

        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-gray-300">
            Dashboard
          </li>
          <li className="cursor-pointer hover:text-gray-300">
            Assignments
          </li>
        </ul>

        <button
          onClick={logout}
          className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard ({role})
        </h1>

        {assignments.length === 0 ? (
          <p className="text-gray-600">
            No assignments available.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {assignment.title}
                </h2>

                <p className="text-gray-600">
                  Subject: {assignment.subject}
                </p>

                <p className="text-gray-600 mb-4">
                  Due: {new Date(
                    assignment.dueDate
                  ).toDateString()}
                </p>

                {role === "student" && (
                    <button
                      onClick={() =>
                        navigate(`/assignment/${assignment._id}`)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      View & Submit
                    </button>
                )}

                {role === "staff" && (
                  <button
                    onClick={() =>
                      navigate(`/review/${assignment._id}`)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    View Submissions
                  </button>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;