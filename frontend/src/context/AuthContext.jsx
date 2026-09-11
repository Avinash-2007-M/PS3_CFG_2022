import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('wqc_token')))

  useEffect(() => {
    const token = localStorage.getItem('wqc_token')
    if (!token) return

    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('wqc_token'))
      .finally(() => setLoading(false))
  }, [])

  const authenticate = (data) => {
    localStorage.setItem('wqc_token', data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('wqc_token')
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, authenticate, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
