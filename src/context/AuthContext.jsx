/* ═══════════════════════════════════════════════════════════════════
   AuthContext — Firebase Authentication for HydroTrack
   Uses Firebase Auth with Email/Password for persistent accounts.
   Accounts are saved permanently in Firebase cloud database.
   ═══════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Listen for auth state changes (persists across refreshes) ───── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  /* ── Register ────────────────────────────────────────────────────── */
  async function register({ name, email, password, confirmPassword }) {
    if (password !== confirmPassword) throw new Error('Passwords do not match')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')

    const cred = await createUserWithEmailAndPassword(auth, email, password)

    // Save display name to the Firebase profile
    await updateProfile(cred.user, { displayName: name })

    const userData = { id: cred.user.uid, name, email: cred.user.email }
    setUser(userData)
    return userData
  }

  /* ── Login ───────────────────────────────────────────────────────── */
  async function login({ email, password }) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const userData = {
        id: cred.user.uid,
        name: cred.user.displayName || cred.user.email.split('@')[0],
        email: cred.user.email,
      }
      setUser(userData)
      return userData
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      const code = err.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password')
      } else if (code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.')
      } else {
        throw new Error(err.message || 'Login failed')
      }
    }
  }

  /* ── Logout ──────────────────────────────────────────────────────── */
  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  /* ── Compatibility helpers (kept for existing components) ────────── */
  function getAccessToken() {
    return auth.currentUser?.accessToken || null
  }

  async function authFetch(url, options = {}) {
    const token = await auth.currentUser?.getIdToken()
    return fetch(url, {
      ...options,
      headers: { ...(options.headers ?? {}), Authorization: `Bearer ${token}` },
    })
  }

  async function refreshAccessToken() {
    return auth.currentUser?.getIdToken(true)
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
