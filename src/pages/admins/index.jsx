"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash, UserPlus } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { userService } from "@/services/user-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function AdminsPage() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)

  const isSuperAdmin = user?.role === "SUPER_ADMIN"

  useEffect(() => {
    fetchAdmins()
  }, [currentPage, searchQuery])

  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const response = await userService.getAdmins({
        page: currentPage,
        limit: 10,
        search: searchQuery,
      })

      setAdmins(response.users)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Error fetching admins:", error)
      toast.error("Failed to fetch admins")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return

    try {
      await userService.deleteUser(adminToDelete.id)
      setAdmins(admins.filter((a) => a.id !== adminToDelete.id))
      toast.success(`Admin ${adminToDelete.username} deleted successfully`)
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast.error("Failed to delete admin")
    }
  }

  const handleStatusChange = async (adminId, newStatus) => {
    try {
      await userService.updateUserStatus(adminId, newStatus)
      setAdmins(admins.map((a) => (a.id === adminId ? { ...a, status: newStatus } : a)))
      toast.success(`Admin status updated successfully`)
    } catch (error) {
      console.error("Error updating admin status:", error)
      toast.error("Failed to update admin status")
    }
  }

  const confirmDelete = (admin) => {
    setAdminToDelete(admin)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
        {isSuperAdmin && (
          <Button asChild>
            <Link to="/users/create">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[300px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center py-10">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.username}</TableCell>
                  <TableCell>
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === "SUPER_ADMIN" ? "destructive" : "default"}>{admin.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={admin.status === "ACTIVE" ? "outline" : "secondary"}
                      className={
                        admin.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                      }
                    >
                      {admin.status}
                    </Badge>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/users/${admin.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {admin.status === "ACTIVE" ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(admin.id, "INACTIVE")}>
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(admin.id, "ACTIVE")}>
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmDelete(admin)}
                            disabled={admin.id === user?.id}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the admin account for {adminToDelete?.username}
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
