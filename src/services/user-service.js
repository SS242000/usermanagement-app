// Mock user service

// Generate mock users
const generateMockUsers = (count) => {
  const users = []
  const roles = ["USER", "ADMIN", "SUPER_ADMIN"]
  const statuses = ["ACTIVE", "INACTIVE"]

  for (let i = 1; i <= count; i++) {
    const role = i <= 3 ? roles[Math.min(i - 1, 2)] : roles[0]
    users.push({
      id: `${i}`,
      username: i <= 3 ? ["superadmin", "admin", "user"][i - 1] : `user${i}`,
      email:
        i <= 3 ? [`superadmin@example.com`, `admin@example.com`, `user@example.com`][i - 1] : `user${i}@example.com`,
      firstName: i <= 3 ? ["Super", "Admin", "Normal"][i - 1] : `First${i}`,
      lastName: i <= 3 ? ["Admin", "User", "User"][i - 1] : `Last${i}`,
      role,
      status: i % 5 === 0 ? "INACTIVE" : "ACTIVE",
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Each user created a day apart
      updatedAt: new Date(Date.now() - i * 43200000).toISOString(), // Each user updated half a day apart
    })
  }

  return users
}

// Mock users data
const mockUsers = generateMockUsers(50)

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export const getInitials=(firstName, lastName)=>{
  console.log(firstName, lastName)
  if (!firstName && !lastName) return "U"
  const firstInitial = firstName ? firstName[0].toUpperCase() : ""
  const lastInitial = lastName ? lastName[0].toUpperCase() : ""
  console.log(firstInitial, lastInitial)
  return `${firstInitial}${lastInitial}`
}
export const userService = {
  // Get users with pagination, filtering, and search
  async getUsers({ page = 1, limit = 10, search = "", role = "", status = "" }) {
    await delay(1000) 

    let filteredUsers = [...mockUsers]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower),
      )
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Apply status filter
    if (status) {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    // Calculate pagination
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      users: paginatedUsers,
      totalUsers,
      totalPages,
      currentPage: page,
    }
  },

  // Get admins with pagination and search
  async getAdmins({ page = 1, limit = 10, search = "" }) {
    await delay(1000) // Simulate API delay

    let filteredUsers = mockUsers.filter((user) => user.role === "ADMIN" || user.role === "SUPER_ADMIN")

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower),
      )
    }

    // Calculate pagination
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      users: paginatedUsers,
      totalUsers,
      totalPages,
      currentPage: page,
    }
  },

  // Get user by ID
  async getUserById(id) {
    await delay(500) // Simulate API delay

    const user = mockUsers.find((user) => user.id === id)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  },

  // Create user
  async createUser(userData) {
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

    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    return newUser
  },

  // Update user
  async updateUser(id, userData) {
    await delay(1000) // Simulate API delay

    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Check if email already exists (for another user)
    const emailExists = mockUsers.some((u) => u.id !== id && u.email.toLowerCase() === userData.email.toLowerCase())

    if (emailExists) {
      throw new Error("Email already in use")
    }

    // Check if username already exists (for another user)
    const usernameExists = mockUsers.some(
      (u) => u.id !== id && u.username.toLowerCase() === userData.username.toLowerCase(),
    )

    if (usernameExists) {
      throw new Error("Username already in use")
    }

    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    mockUsers[userIndex] = updatedUser

    return updatedUser
  },

  // Delete user
  async deleteUser(id) {
    await delay(1000) // Simulate API delay

    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Remove user
    mockUsers.splice(userIndex, 1)

    return { success: true }
  },

  // Update user status
  async updateUserStatus(id, status) {
    await delay(500) // Simulate API delay

    const userIndex = mockUsers.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user status
    mockUsers[userIndex].status = status
    mockUsers[userIndex].updatedAt = new Date().toISOString()

    return mockUsers[userIndex]
  },

  // Get dashboard stats
  async getStats() {
    await delay(1000) // Simulate API delay

    const totalUsers = mockUsers.length
    const activeUsers = mockUsers.filter((user) => user.status === "ACTIVE").length
    const inactiveUsers = totalUsers - activeUsers
    const totalAdmins = mockUsers.filter((user) => user.role === "ADMIN" || user.role === "SUPER_ADMIN").length

    // Users created in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentlyCreated = mockUsers.filter((user) => new Date(user.createdAt) >= sevenDaysAgo).length

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalAdmins,
      recentlyCreated,
    }
  },

   
}
