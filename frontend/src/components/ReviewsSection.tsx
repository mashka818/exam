import { useState, useEffect } from 'react'
import { reviews } from '../api/api'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'
import './ReviewsSection.css'

interface Review {
  id: string
  text: string
  rating: number
  createdAt: string
  user?: {
    fullName: string
  }
}

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const { data } = await reviews.getLatest(6)
      if (data && Array.isArray(data)) {
        setReviewsList(data)
      }
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error)
      setReviewsList([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <section className="reviews-section">
        <div className="container">
          <h2>Загрузка отзывов...</h2>
        </div>
      </section>
    )
  }

  if (!reviewsList || reviewsList.length === 0) {
    return null
  }

  return (
    <section className="reviews-section">
      <div className="container">
        <h2>Отзывы наших студентов</h2>
        <div className="reviews-grid">
          {reviewsList.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <FaQuoteLeft className="quote-icon" />
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < review.rating ? 'star-filled' : 'star-empty'} 
                    />
                  ))}
                </div>
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-footer">
                <p className="review-author">{review.user?.fullName || 'Анонимный пользователь'}</p>
                <p className="review-date">{formatDate(review.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

