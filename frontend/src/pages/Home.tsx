import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
import ReviewsSection from '../components/ReviewsSection'
import { useAuth } from '../context/AuthContext'
import { FaBullseye, FaChalkboardTeacher, FaCertificate, FaClock } from 'react-icons/fa'
import './Home.css'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home">
      <div className="container">
        <Slider />
        
        <section className="hero">
          <h1 className="animate-fade-in">Лучшие онлайн курсы дополнительного профессионального образования</h1>
          
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Подать заявку
            </Link>
            <Link to="/applications" className="btn btn-secondary btn-lg">
              Мои заявки
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBullseye />
            </div>
            <h3>Практические навыки</h3>
            <p>Реальные проекты и кейсы из практики</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChalkboardTeacher />
            </div>
            <h3>Опытные преподаватели</h3>
            <p>Эксперты с многолетним опытом работы</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCertificate />
            </div>
            <h3>Официальные сертификаты</h3>
            <p>Подтвердите свою квалификацию</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3>Гибкий график</h3>
            <p>Учитесь в удобное время</p>
          </div>
        </section>
      </div>
      
      <ReviewsSection />
    </div>
  )
}
