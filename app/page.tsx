"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { CitizenDashboard } from "@/components/citizen-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { LandingPage } from "@/components/landing-page"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user && !showLogin) {
    return <LandingPage onGetStarted={() => setShowLogin(true)} />
  }

  if (!user && showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return user.role === "administrator" ? <AdminDashboard /> : <CitizenDashboard />
}
