/* ═══════════════════════════════════════════════════════════════════
   AuthContext — Static Mock Auth for HydroTrack Prototype
   Stores users and active session entirely in browser localStorage.
   No backend server required. Free to host anywhere (GitHub Pages, etc).
   ═══════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('hydrotrack_session')
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch (err) {
        localStorage.removeItem('hydrotrack_session')
      }
    }
    setLoading(false)
  }, [])

  async function register({ name, email, password, confirmPassword }) {
    await delay(800) // Simulate network request
    if (password !== confirmPassword) throw new Error("Passwords do not match")
    if (password.length < 6) throw new Error("Password must be at least 6 characters")
    
    const users = JSON.parse(localStorage.getItem('hydrotrack_users') || '[]')
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email is already registered")
    }

    const newUser = { id: Date.now().toString(), name, email }
    users.push({ ...newUser, password }) // Store password just for mock prototype
    localStorage.setItem('hydrotrack_users', JSON.stringify(users))

    localStorage.setItem('hydrotrack_session', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  async function login({ email, password }) {
    await delay(800) // Simulate network request
    const users = JSON.parse(localStorage.getItem('hydrotrack_users') || '[]')
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    
    if (!found) throw new Error("Invalid email or password")

    const sessionUser = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem('hydrotrack_session', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  async function logout() {
    await delay(400)
    localStorage.removeItem('hydrotrack_session')
    setUser(null)
  }

  function getAccessToken() {
    return 'mock-token-12345'
  }

  async function authFetch(url, options = {}) {
    // Just a passthrough for the static prototype
    return fetch(url, options)
  }

  async function refreshAccessToken() {
    return 'mock-token-12345'
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    getAccessToken,
    register,
    login,
    logout,
    authFetch,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
