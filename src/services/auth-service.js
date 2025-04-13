// Mock authentication service

// Mock user data
const mockUsers = [
  {
    id: "1",
    username: "superadmin",
    email: "superadmin@whitemastery.com",
    firstName: "Super",
    lastName: "Admin",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    username: "admin",
    email: "admin@whitemastery.com",
    firstName: "Admin",
    lastName: "User",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    username: "user",
    email: "user@whitemastery.com",
    firstName: "Normal",
    lastName: "User",
    role: "USER",
    status: "ACTIVE",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
]

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  // Login user
  async login(email, password) {
    await delay(1000) // Simulate API delay

    // Find user by email
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())

    console.log("User",user)

    if(password !== "P@ssword2!") {
      throw new Error("Invalid password")
    }

    if (!user) {
      throw new Error("Invalid email or password")
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Your account is inactive. Please contact an administrator.")
    }

    // Generate a fake token
    const token = `fake-jwt-token-${user.id}-${Date.now()}`

    return { user, token }
  },

  // Register new user
  async signup(userData) {
    await delay(1000) // Simulate API delay

    // Check if email already exists
    const emailExists = mockUsers.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())

    if (emailExists) {
      throw new Error("Email already in use")
    }

    // Check if username already exists
    const usernameExists = mockUsers.some((u) => u.username.toLowerCase() === userData.username.toLowerCase())

    if (usernameExists) {
      throw new Error("Username already in use")
    }

    // Create new user (in a real app, we'd save to database)
    const newUser = {
      id: `${mockUsers.length + 1}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    return { success: true }
  },

  // Get current user
  async getCurrentUser() {
    await delay(500) // Simulate API delay

    // In a real app, we'd decode the JWT token and fetch user data
    // For this mock, we'll just return the first user
    return mockUsers[0]
  },

  // Update user profile
  async updateProfile(userData) {
    await delay(1000) // Simulate API delay

    // In a real app, we'd update the user in the database
    // For this mock, we'll just return the updated user
    return {
      ...mockUsers[0],
      ...userData,
      updatedAt: new Date().toISOString(),
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    await delay(1000) // Simulate API delay

    // In a real app, we'd verify the current password and update it
    // For this mock, we'll just return success
    return { success: true }
  },
}
