import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../api/api'
import './Auth.css'

export default function Login() {
  const [formData, setFormData] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const { data } = await auth.login(formData)
      login(data.access_token)
      navigate('/')
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else {
        setErrors({ general: 'Ошибка входа' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <h1>Вход в систему</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="auth-link">
          Еще не зарегистрированы? <Link to="/register">Регистрация</Link>
        </p>
      </div>
    </div>
  )
}



