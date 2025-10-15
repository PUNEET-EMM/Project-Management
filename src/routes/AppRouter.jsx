import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import { RequireAuth, RedirectIfAuth } from "./RouteGuards";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<RedirectIfAuth />}>
          <Route path="/*" element={<PublicRoutes />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/dashboard/*" element={<PrivateRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
}