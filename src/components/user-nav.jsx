"use client"

import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"

import {getInitials} from "@/services/user-service"

export function UserNav() {
  const { user, logout } = useAuth()

  // const getInitials = (firstName, lastName) => {
  //   console.log(firstName, lastName)
  //   if (!firstName && !lastName) return "U"
  //   const firstInitial = firstName ? firstName[0].toUpperCase() : ""
  //   const lastInitial = lastName ? lastName[0].toUpperCase() : ""
  //   console.log(firstInitial, lastInitial)
  //   return `${firstInitial}${lastInitial}`
  // }

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.username || "User"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
            
            <AvatarFallback className="  text-black outline-dotted dark:text-white dark:bg-black ">{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">{getFullName()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{getFullName()}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className=" hover:cursor-pointer">
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className=" hover:cursor-pointer">
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" hover:cursor-pointer" onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}