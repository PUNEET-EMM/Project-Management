import { Routes, Route } from "react-router-dom";
import Login from "../pages/public/Login";



export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}