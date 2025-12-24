import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applications, reviews } from '../api/api'
import './Applications.css'

export default function Applications() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const { data } = await applications.getMy()
      setApps(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await reviews.create({ text: reviewText, rating: reviewRating })
      alert('Отзыв успешно добавлен!')
      setReviewText('')
      setReviewRating(5)
      setShowReviewForm(false)
    } catch (error) {
      alert('Ошибка при добавлении отзыва')
    }
  }

  const getStatusText = (status: string) => {
    const map: any = {
      'NEW': 'Новая',
      'IN_PROGRESS': 'Идет обучение',
      'COMPLETED': 'Обучение завершено'
    }
    return map[status] || status
  }

  const getStatusClass = (status: string) => {
    const map: any = {
      'NEW': 'status-new',
      'IN_PROGRESS': 'status-progress',
      'COMPLETED': 'status-completed'
    }
    return map[status] || ''
  }

  const canLeaveReview = apps.some(app => app.status === 'COMPLETED')

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="applications-page">
      <div className="container">
        <div className="page-header">
          <h1>Мои заявки</h1>
          <Link to="/applications/create" className="btn btn-primary">
            + Новая заявка
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="empty-state">
            <p>У вас пока нет заявок</p>
            <Link to="/applications/create" className="btn btn-primary">
              Подать заявку
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {apps.map((app) => (
              <div key={app.id} className="application-card animate-fade-in">
                <div className="app-header">
                  <h3>{app.course.name}</h3>
                  <span className={`status-badge ${getStatusClass(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>
                
                <div className="app-details">
                  <p><strong>Преподаватель:</strong> {app.course.teacher}</p>
                  <p><strong>Дата начала:</strong> {new Date(app.startDate).toLocaleDateString('ru')}</p>
                  <p><strong>Оплата:</strong> {app.paymentMethod === 'CASH' ? 'Наличными' : 'Перевод по телефону'}</p>
                  <p><strong>Создана:</strong> {new Date(app.createdAt).toLocaleString('ru')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {canLeaveReview && (
          <div className="review-section">
            <h2>Оставить отзыв</h2>
            <p>Вы завершили обучение и можете оставить отзыв о качестве услуг</p>
            
            {!showReviewForm ? (
              <button 
                onClick={() => setShowReviewForm(true)} 
                className="btn btn-primary"
              >
                Написать отзыв
              </button>
            ) : (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label>Оценка</label>
                  <select 
                    value={reviewRating} 
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{'⭐'.repeat(num)} ({num})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Текст отзыва</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    required
                    placeholder="Расскажите о вашем опыте обучения..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Отправить отзыв
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)} 
                    className="btn btn-secondary"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}



