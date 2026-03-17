import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AssignmentDetails from "./pages/AssignmentDetails";
import SubmissionDetails from "./pages/SubmissionDetails";
import ReviewPage from "./pages/ReviewPage";
import MySubmissions from "./pages/MySubmissions";
import CreateAssignment from "./pages/CreateAssignment";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If role isn't matched, redirect to their home dashboard
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "staff" ? "/staff" : "/dashboard"} replace />;
  }

  return children;
};

import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRole="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-submissions"
            element={
              <ProtectedRoute allowedRole="student">
                <MySubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-assignment"
            element={
              <ProtectedRoute allowedRole="staff">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />

          {/* Assignments and Submissions can be viewed by the relevant role, 
              so we just protect them from non-logged in users */}
          <Route
            path="/assignment/:id"
            element={
              <ProtectedRoute>
                <AssignmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/:id"
            element={
              <ReviewPage />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;