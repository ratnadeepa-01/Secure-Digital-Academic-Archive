import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// We use StaffDashboard directly now, so redirect any standalone reviews there.
function ReviewPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/staff", { replace: true });
  }, [navigate]);

  return null;
}

export default ReviewPage;