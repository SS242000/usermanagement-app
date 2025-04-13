"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bell, Search, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/auth"
import { useSidebar } from "@/lib/sidebar-context"

export function Header() {
  const { user } = useAuth()
  const { toggleSidebar } = useSidebar()
  const [searchQuery, setSearchQuery] = useState("")
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
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/dashboard" className="font-semibold">
            User Management
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button> */}
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 rou" /> : <Moon className="h-5 w-5" />}
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}