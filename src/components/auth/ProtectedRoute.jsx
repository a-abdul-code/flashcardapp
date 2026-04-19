import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth.jsx";

export default function ProtectedRoute({ children }) {
  const { session } = useAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return session ? children : <Navigate to="/" />;
}
