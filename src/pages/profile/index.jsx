"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import {getInitials} from "@/services/user-service"
const profileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, {
      message: "New password must be at least 6 characters",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = async (data) => {
    setIsProfileLoading(true)
    try {
      await updateProfile(data)
    } finally {
      setIsProfileLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true)
    try {
      const success = await changePassword(data.currentPassword, data.newPassword)
      if (success) {
        resetPassword()
      }
    } finally {
      setIsPasswordLoading(false)
    }
  }

  

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.username || "User"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {/* <AvatarImage  /> */}
              <AvatarFallback className="  text-black outline-dotted dark:text-white dark:bg-black text-3xl font-bold">{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
              </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-medium">{getFullName()}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Badge>{user?.role}</Badge>
            <div className="w-full pt-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Username</span>
                <span>{user?.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <span>{user?.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Member since</span>
                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              {/* <TabsTrigger value="password">Password</TabsTrigger> */}
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" {...registerProfile("firstName")} />
                        {profileErrors.firstName && (
                          <p className="text-sm text-destructive">{profileErrors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" {...registerProfile("lastName")} />
                        {profileErrors.lastName && (
                          <p className="text-sm text-destructive">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...registerProfile("username")} />
                      {profileErrors.username && (
                        <p className="text-sm text-destructive">{profileErrors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...registerProfile("email")} />
                      {profileErrors.email && <p className="text-sm text-destructive">{profileErrors.email.message}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isProfileLoading}>
                      {isProfileLoading ? "Saving..." : "Save changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isPasswordLoading}>
                      {isPasswordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
