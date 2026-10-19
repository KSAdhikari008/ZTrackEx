import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/authHook";

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (user.status === "loading") {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

  // Fail-closed guard: only allow entry if explicitly authenticated
  if (user.status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;