/* ═══════════════════════════════════════════════════════════════════
   AuthContext — JWT auth state for HydroTrack
   Access token stored in memory (ref) — never in localStorage.
   Refresh token lives in httpOnly cookie managed by the server.
   ═══════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const AuthContext = createContext(null)

const API = '/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)   // true while silent-refresh runs on mount
  const accessTokenRef        = useRef(null)      // in-memory only

  /* ── Helpers ─────────────────────────────────────────────────────── */
  function setSession(accessToken, userData) {
    accessTokenRef.current = accessToken
    setUser(userData)
  }

  function clearSession() {
    accessTokenRef.current = null
    setUser(null)
  }

  /* ── Public getter for axios/fetch calls ─────────────────────────── */
  function getAccessToken() {
    return accessTokenRef.current
  }

  /* ── Silent refresh on mount (restores session from cookie) ─────── */
  const silentRefresh = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/refresh`, { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setSession(data.accessToken, data.user)
      } else {
        clearSession()
      }
    } catch {
      clearSession()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    silentRefresh()
  }, [silentRefresh])

  /* ── Auth actions ────────────────────────────────────────────────── */
  async function register({ name, email, password, confirmPassword }) {
    const res  = await fetch(`${API}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    })
    const data = await res.json()
    if (!data.success) {
      const msg = data.errors?.[0]?.msg ?? data.message ?? 'Registration failed'
      throw new Error(msg)
    }
    setSession(data.accessToken, data.user)
    return data.user
  }

  async function login({ email, password }) {
    const res  = await fetch(`${API}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message ?? 'Login failed')
    setSession(data.accessToken, data.user)
    return data.user
  }

  async function logout() {
    try {
      await fetch(`${API}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessTokenRef.current}` },
      })
    } catch { /* ignore network errors on logout */ }
    clearSession()
  }

  async function refreshAccessToken() {
    const res  = await fetch(`${API}/refresh`, { method: 'POST', credentials: 'include' })
    const data = await res.json()
    if (data.success) {
      setSession(data.accessToken, data.user)
      return data.accessToken
    }
    clearSession()
    throw new Error('Session expired')
  }

  /* ── Authenticated fetch wrapper (auto-retries with new token) ───── */
  async function authFetch(url, options = {}) {
    const token = accessTokenRef.current
    const makeReq = (tkn) => fetch(url, {
      ...options,
      credentials: 'include',
      headers: { ...(options.headers ?? {}), Authorization: `Bearer ${tkn}` },
    })

    let res = await makeReq(token)
    if (res.status === 401) {
      try {
        const newToken = await refreshAccessToken()
        res = await makeReq(newToken)
      } catch {
        clearSession()
        throw new Error('Session expired — please log in again')
      }
    }
    return res
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
