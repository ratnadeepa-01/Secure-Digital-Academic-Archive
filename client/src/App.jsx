import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AssignmentDetails from "./pages/AssignmentDetails";
import SubmissionDetails from "./pages/SubmissionDetails";
import ReviewPage from "./pages/ReviewPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            token && role === "student"
              ? <StudentDashboard />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/staff"
          element={
            token && role === "staff"
              ? <StaffDashboard />
              : <Navigate to="/" />
          }
        />

        <Route path="/assignment/:id" element={<AssignmentDetails />} />
        <Route path="/submission/:id" element={<SubmissionDetails />} />
        <Route path="/review/:id" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;