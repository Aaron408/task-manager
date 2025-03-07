"use client"

import { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import LandingPage from "../Pages/LandingPage/LandingPage"
import Login from "../Pages/LoginPage/LoginPage"
import RegisterPage from "../Pages/RegisterPage/RegisterPage"
import DashboardPage from "../Pages/Dashboard/DashboardPage"
import TasksPage from "../Pages/Tasks/TasksPage"
import GroupsPage from "../Pages/Groups/GroupsPage"

import { AuthContext, PrivateRoute } from "../Components/AuthContext"

const Navigation = () => {
  const { user } = useContext(AuthContext)

  // Redirección específica según el rol del usuario
  const roleRedirects = {
    admin: "/dashboard",
    mortal: "/tasks",
  }

  return (
    <Routes>
      <Route path="*" element={<h1>Tas perdido o k?</h1>} />
      <Route path="/" element={user ? <Navigate to={roleRedirects[user.role] || "/tasks"} /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={roleRedirects[user.role] || "/tasks"} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={roleRedirects[user.role] || "/tasks"} /> : <RegisterPage />}/>

      <Route element={<PrivateRoute allowedRoles={["admin", "mortal"]} />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/groups" element={<GroupsPage />} />
      </Route>
    </Routes>
  )
}

export default Navigation

