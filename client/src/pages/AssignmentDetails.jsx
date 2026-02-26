import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function AssignmentDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
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

      alert("Submission successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">
          Submit Assignment
        </h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default AssignmentDetails;