import { useState, useEffect } from 'react'
import { applications } from '../api/api'
import './AdminPanel.css'

export default function AdminPanel() {
  const [apps, setApps] = useState<any[]>([])
  const [filteredApps, setFilteredApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [apps, filter])

  const loadApplications = async () => {
    try {
      const { data } = await applications.getAll()
      setApps(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    if (filter === 'ALL') {
      setFilteredApps(apps)
    } else {
      setFilteredApps(apps.filter(app => app.status === filter))
    }
    setCurrentPage(1)
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await applications.updateStatus(id, status)
      loadApplications()
      showNotification('Статус успешно изменен')
    } catch (error) {
      showNotification('Ошибка при изменении статуса', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }

  const getStatusText = (status: string) => {
    const map: any = {
      'NEW': 'Новая',
      'IN_PROGRESS': 'Идет обучение',
      'COMPLETED': 'Обучение завершено'
    }
    return map[status] || status
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Панель администратора</h1>

        <div className="admin-controls">
          <div className="filter-group">
            <label>Фильтр по статусу:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">Все ({apps.length})</option>
              <option value="NEW">Новые ({apps.filter(a => a.status === 'NEW').length})</option>
              <option value="IN_PROGRESS">В процессе ({apps.filter(a => a.status === 'IN_PROGRESS').length})</option>
              <option value="COMPLETED">Завершенные ({apps.filter(a => a.status === 'COMPLETED').length})</option>
            </select>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{filteredApps.length}</div>
              <div className="stat-label">Всего заявок</div>
            </div>
          </div>
        </div>

        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Студент</th>
                <th>Курс</th>
                <th>Дата начала</th>
                <th>Оплата</th>
                <th>Создана</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((app) => (
                <tr key={app.id} className="animate-fade-in">
                  <td>{app.user.fullName}</td>
                  <td>{app.course.name}</td>
                  <td>{new Date(app.startDate).toLocaleDateString('ru')}</td>
                  <td>{app.paymentMethod === 'CASH' ? 'Наличные' : 'Перевод'}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString('ru')}</td>
                  <td>
                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                      {getStatusText(app.status)}
                    </span>
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="NEW">Новая</option>
                      <option value="IN_PROGRESS">Идет обучение</option>
                      <option value="COMPLETED">Завершено</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary"
            >
              Назад
            </button>
            
            <span className="page-info">
              Страница {currentPage} из {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
            >
              Вперед
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



