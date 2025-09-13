"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "citizen" | "administrator"

export interface User {
  id: string
  name: string
  email?: string
  aadhaar?: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (credentials: { aadhaar?: string; email?: string; password?: string }, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("civicconnect_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (
    credentials: { aadhaar?: string; email?: string; password?: string },
    role: UserRole,
  ): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would call an API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: credentials.email ? credentials.email.split("@")[0] : `User-${credentials.aadhaar?.slice(-4)}`,
        email: credentials.email,
        aadhaar: credentials.aadhaar,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("civicconnect_user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("civicconnect_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
