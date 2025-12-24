import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { applications, courses } from '../api/api'
import './Auth.css'

export default function CreateApplication() {
  const [coursesList, setCoursesList] = useState<any[]>([])
  const [formData, setFormData] = useState({
    courseName: '',
    startDate: '',
    paymentMethod: 'CASH'
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    loadCourses()
    if (location.state?.courseName) {
      setFormData(prev => ({ ...prev, courseName: location.state.courseName }))
    }
  }, [location])

  const loadCourses = async () => {
    try {
      const { data } = await courses.getAll()
      setCoursesList(data)
    } catch (error) {
      console.error(error)
    }
  }

  const validate = () => {
    const newErrors: any = {}
    
    if (!formData.courseName) {
      newErrors.courseName = 'Выберите курс'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Укажите дату начала'
    }
    
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/
    if (formData.startDate && !dateRegex.test(formData.startDate)) {
      newErrors.startDate = 'Формат даты должен быть ДД.ММ.ГГГГ'
    }
    
    return newErrors
  }

  const convertDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.')
    return `${year}-${month}-${day}`
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
      await applications.create({
        ...formData,
        startDate: convertDate(formData.startDate)
      })
      navigate('/applications')
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Ошибка создания заявки' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <h1>Подать заявку на курс</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label>Курс *</label>
            <select
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              required
            >
              <option value="">Выберите курс</option>
              {coursesList.map(course => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.courseName && <div className="error-text">{errors.courseName}</div>}
          </div>

          <div className="form-group">
            <label>Дата начала обучения *</label>
            <input
              type="text"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="01.03.2024"
              required
            />
            {errors.startDate && <div className="error-text">{errors.startDate}</div>}
            <small>Формат: ДД.ММ.ГГГГ</small>
          </div>

          <div className="form-group">
            <label>Способ оплаты *</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              required
            >
              <option value="CASH">Наличными</option>
              <option value="PHONE_TRANSFER">Перевод по номеру телефона</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  )
}



