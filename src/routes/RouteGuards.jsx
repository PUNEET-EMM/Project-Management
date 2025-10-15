import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Custom hook to check authentication from Redux store
const useIsAuthenticated = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return isAuthenticated && user !== null;
};

export function RequireAuth() {
  const authed = useIsAuthenticated();
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RedirectIfAuth() {
  const authed = useIsAuthenticated();

  if (authed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}