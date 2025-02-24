import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "../Pages/LandingPage/LandingPage";
import Login from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import DashboardPage from "../Pages/Dashboard/DashboardPage";
import TasksPage from "../Pages/Tasks/TasksPage";
import GroupsPage from "../Pages/Groups/GroupsPage";

const Navigation = () => {
  return (
    <Routes>
      <Route path="*" element={<h1>Tas perdido o k?</h1>} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/groups" element={<GroupsPage />} />
    </Routes>
  );
};

export default Navigation;
