import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "./lib/auth"
import { SidebarProvider } from "./lib/sidebar-context"
import { MainLayout } from "./components/layout/main-layout"
import { LoginPage } from "./pages/auth/login"
import { SignupPage } from "./pages/auth/signup"
import { DashboardPage } from "./pages/dashboard/index"
import { UsersPage } from "./pages/users"
import { UserForm } from "./pages/users/user-form"
import { AdminsPage } from "./pages/admins"
import { ProfilePage } from "./pages/profile"

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/create" element={<UserForm />} />
              <Route path="/users/:id" element={<UserForm />} />
              <Route path="/admins" element={<AdminsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<ProfilePage />} />
            </Route>
          </Routes>

          <Toaster position="top-right" duration={1000}/>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
