import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { users } from '../api/api'

interface User {
  id: string
  login: string
  fullName: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await users.getProfile()
      setUser(data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = (token: string) => {
    localStorage.setItem('token', token)
    fetchUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}



