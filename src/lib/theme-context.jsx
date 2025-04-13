"use client"

import React, { useState, useEffect } from "react"

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check local storage for the saved theme
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"
    }
    return "light"
  })

  useEffect(() => {
    // Apply the theme class to the <html> element
    const root = window.document.documentElement
    root.classList.remove(theme === "dark" ? "light" : "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const ThemeContext = React.createContext({
  theme: "light",
  toggleTheme: () => {},
})