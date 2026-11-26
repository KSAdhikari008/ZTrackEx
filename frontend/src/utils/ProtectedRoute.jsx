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
  if(user.status == "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if(user.status == "server error"){
    return <Navigate to="/serverError" />
  }
  if(user.status === "rate limited"){
    return <Navigate to="/serverError" replace state={{ reason: "rate-limited" }} />
  }

  return <Outlet />;
}

export default ProtectedRoute;