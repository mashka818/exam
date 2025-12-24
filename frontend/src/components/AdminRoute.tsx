import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return isAdmin() ? <>{children}</> : <Navigate to="/" />
}



