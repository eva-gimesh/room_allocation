"use client"

import { useState } from "react"
import { LoginScreen } from "./login-screen"
import { StudentDashboard } from "./student-dashboard"
import { FacultyDashboard } from "./faculty-dashboard"
import { RoomBookingGawdDashboard } from "./room-booking-gawd-dashboard"
import { SecurityDashboard } from "./security-dashboard"
import { CTSDashboard } from "./cts-dashboard"

export type UserRole = "student" | "faculty" | "room-gawd" | "security" | "cts" | null

export function LandingPage() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [userName, setUserName] = useState("")

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role)
    setUserName(name)
  }

  const handleLogout = () => {
    setUserRole(null)
    setUserName("")
  }

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (userRole === "student") {
    return <StudentDashboard userName={userName} onLogout={handleLogout} />
  }

  if (userRole === "faculty") {
    return <FacultyDashboard userName={userName} onLogout={handleLogout} />
  }

  if (userRole === "room-gawd") {
    return <RoomBookingGawdDashboard userName={userName} onLogout={handleLogout} />
  }

  if (userRole === "security") {
    return <SecurityDashboard userName={userName} onLogout={handleLogout} />
  }

  if (userRole === "cts") {
    return <CTSDashboard userName={userName} onLogout={handleLogout} />
  }

  return null
}
