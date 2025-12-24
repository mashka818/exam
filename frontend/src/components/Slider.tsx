import { useState, useEffect } from 'react'
import './Slider.css'

const slides = [
  {
    image: '/src/images/devuska-srednego-rosta-izucaet-matematiku-v-skole.jpg',
    title: 'Профессиональное обучение',
    description: 'Получите новые навыки с лучшими преподавателями'
  },
  {
    image: '/src/images/devuska-srednego-rosta-izucaet-matematiku-v-skole.jpg',
    title: 'Онлайн курсы',
    description: 'Учитесь в удобное для вас время'
  },
  {
    image: '/src/images/devuska-srednego-rosta-izucaet-matematiku-v-skole.jpg',
    title: 'Сертификаты',
    description: 'Подтвердите свою квалификацию официальным документом'
  },
  {
    image: '/src/images/devuska-srednego-rosta-izucaet-matematiku-v-skole.jpg',
    title: 'Карьерный рост',
    description: 'Откройте новые возможности для развития'
  }
]

export default function Slider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="slider">
      <div className="slider-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.image} alt={slide.title} />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="slider-btn slider-btn-prev" onClick={prev}>‹</button>
      <button className="slider-btn slider-btn-next" onClick={next}>›</button>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}



