import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courses, BACKEND_URL } from '../api/api'
import { useAuth } from '../context/AuthContext'
import defaultImage from '../images/devuska-srednego-rosta-izucaet-matematiku-v-skole.jpg'
import './Courses.css'

export default function Courses() {
  const [coursesList, setCoursesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const { data } = await courses.getAll()
      setCoursesList(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return defaultImage
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${BACKEND_URL}${path}`
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="courses-page">
      <div className="container">
        <h1>Наши курсы</h1>
        
        {coursesList.length === 0 ? (
          <p>Курсы пока не добавлены</p>
        ) : (
          <div className="courses-grid">
            {coursesList.map((course) => (
              <div key={course.id} className="course-card animate-fade-in">
                <img 
                  src={getImageUrl(course.image)} 
                  alt={course.name} 
                  className="course-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage
                  }}
                />
                <div className="course-content">
                  <h3>{course.name}</h3>
                  <p className="course-teacher">👨‍🏫 {course.teacher}</p>
                  <p className="course-description">{course.description}</p>
                  
                  {user && (
                    <Link 
                      to="/applications/create" 
                      state={{ courseName: course.name }}
                      className="btn btn-primary"
                    >
                      Подать заявку
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



