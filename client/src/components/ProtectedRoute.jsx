import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ProtectedRoute({ children }) {
  const { isBlocked } = useApp();

  if (isBlocked) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;