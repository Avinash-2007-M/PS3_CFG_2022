import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/authContext.js'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <main className="loading-screen">Checking your session...</main>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
