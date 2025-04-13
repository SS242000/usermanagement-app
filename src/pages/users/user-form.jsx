"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { userService } from "@/services/user-service"
import { toast } from "sonner"

const userSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.string(),
  status: z.string(),
  password: z.string().optional(),
})

export function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(id ? true : false)

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN"
  const isAdmin = currentUser?.role === "ADMIN" || isSuperAdmin
  const isEditing = !!id

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "USER",
      status: "ACTIVE",
      password: "",
    },
  })

  const watchRole = watch("role")

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setInitialLoading(true)
          const userData = await userService.getUserById(id)

          setValue("username", userData.username)
          setValue("email", userData.email)
          setValue("firstName", userData.firstName)
          setValue("lastName", userData.lastName)
          setValue("role", userData.role)
          setValue("status", userData.status)
          // Don't set password as it's not returned from the API
        } catch (error) {
          console.error("Error fetching user:", error)
          toast.error("Failed to fetch user details")
          navigate("/users")
        } finally {
          setInitialLoading(false)
        }
      }

      fetchUser()
    }
  }, [id, setValue, navigate])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      // If password is empty and we're editing, remove it from the payload
      if (isEditing && !data.password) {
        delete data.password
      }

      if (isEditing) {
        await userService.updateUser(id, data)
        toast.success("User updated successfully")
      } else {
        await userService.createUser(data)
        toast.success("User created successfully")
      }

      navigate("/users")
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error(error.message || "Failed to save user")
    } finally {
      setIsLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit User" : "Create User"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update user information and permissions" : "Add a new user to the system"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{isEditing ? "Password (leave blank to keep current)" : "Password"}</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setValue("role", value)} defaultValue={watch("role")}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN" disabled={!isSuperAdmin}>
                      Admin
                    </SelectItem>
                    <SelectItem value="SUPER_ADMIN" disabled={!isSuperAdmin}>
                      Super Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!isSuperAdmin && watchRole !== "USER" && (
                  <p className="text-sm text-destructive">Only Super Admins can assign Admin roles</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update User" : "Create User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
