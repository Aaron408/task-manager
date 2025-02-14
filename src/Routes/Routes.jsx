import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/LoginPage/LoginPage";
import DashboardPage from "../Pages/Dashboard/DashboardPage";

const Navigation = () => {
  return (
    <Routes>
      <Route path="*" element={<h1>Tas perdido o k?</h1>} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default Navigation;
