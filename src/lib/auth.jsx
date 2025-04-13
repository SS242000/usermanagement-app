"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth-service"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const { user, token } = await authService.login(email, password)
      localStorage.setItem("token", token)
      localStorage.setItem("user",user?.role)
      setUser(user)

      // Redirect based on role
      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
        navigate("/users")
      } else {
        navigate("/dashboard")
      }

      toast.success("Logged in successfully")
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to login")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setIsLoading(true)
      await authService.signup(userData)
      toast.success("Account created successfully. Please login.")
      navigate("/login")
      return true
    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error.message || "Failed to create account")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.setItem("theme","light")
    setUser(null)
    navigate("/login")
    toast.success("Logged out successfully")
  }

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true)
      const updatedUser = await authService.updateProfile(userData)
      setUser(updatedUser)
      toast.success("Profile updated successfully")
      return true
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error(error.message || "Failed to update profile")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true)
      await authService.changePassword(currentPassword, newPassword)
      toast.success("Password changed successfully")
      return true
    } catch (error) {
      console.error("Change password error:", error)
      toast.error(error.message || "Failed to change password")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
