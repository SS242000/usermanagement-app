"use client"

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Users, UserPlus, Settings, Home, Shield, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth"
import { useSidebar } from "@/lib/sidebar-context"

export function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const { isOpen, closeSidebar } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
    },
    {
      title: "User Management",
      href: "/users",
      icon: Users,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      title: "Create User",
      href: "/users/create",
      icon: UserPlus,
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      title: "Admin Management",
      href: "/admins",
      icon: Shield,
      roles: ["SUPER_ADMIN"],
    },
    {
      title: "My Profile",
      href: "/profile",
      icon: User,
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["SUPER_ADMIN", "ADMIN", "USER"],
    },
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
      <div className="flex h-16 items-center border-b px-6">
  <Link to="https://whitemastery.com/index.html" className="flex items-center gap-2 font-semibold" target="_blank">
    <img
      src="https://whitemastery.com/images/wm_logo_letter.svg"
      alt="WHITE MASTERY"
      className="h-12 w-auto dark:bg-slate-50"
    />
  </Link>
</div>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-2">
          {navItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
