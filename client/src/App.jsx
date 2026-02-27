import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AssignmentDetails from "./pages/AssignmentDetails";
import ReviewSubmissions from "./pages/ReviewSubmissions";
import SubmissionDetails from "./pages/SubmissionDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignment/:id" element={<AssignmentDetails />} />
        <Route path="/review/:id" element={<ReviewSubmissions />} />
        <Route path="/submission/:id" element={<SubmissionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;