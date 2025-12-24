import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../api/api'
import './Auth.css'

export default function Register() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const validate = () => {
    const newErrors: any = {}

    if (formData.login.length < 6) {
      newErrors.login = 'Логин должен содержать минимум 6 символов'
    }
    if (!/^[a-zA-Z0-9]+$/.test(formData.login)) {
      newErrors.login = 'Логин должен содержать только латинские буквы и цифры'
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов'
    }
    if (!/^[а-яА-ЯёЁ\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'ФИО должно содержать только кириллицу и пробелы'
    }
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Телефон должен быть в формате 8(XXX)XXX-XX-XX'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const { data } = await auth.register(formData)
      login(data.access_token)
      navigate('/')
    } catch (error: any) {
      if (error.response?.data?.message) {
        const msg = error.response.data.message
        if (Array.isArray(msg)) {
          setErrors({ general: msg.join(', ') })
        } else {
          setErrors({ general: msg })
        }
      } else {
        setErrors({ general: 'Ошибка регистрации' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <h1>Регистрация</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label>Логин *</label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
            />
            {errors.login && <div className="error-text">{errors.login}</div>}
            <small>Латиница и цифры, минимум 6 символов</small>
          </div>

          <div className="form-group">
            <label>Пароль *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
            <small>Минимум 8 символов</small>
          </div>

          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            {errors.fullName && <div className="error-text">{errors.fullName}</div>}
            <small>Только кириллица и пробелы</small>
          </div>

          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="8(999)123-45-67"
              required
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
            <small>Формат: 8(XXX)XXX-XX-XX</small>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-link">
          Уже зарегистрированы? <Link to="/login">Вход</Link>
        </p>
      </div>
    </div>
  )
}



