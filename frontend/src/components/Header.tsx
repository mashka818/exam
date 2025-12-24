import { Link } from 'react-router-dom'
import { FaGraduationCap, FaBook, FaClipboardList, FaUserShield, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <FaGraduationCap /> Корочки.есть
        </Link>
        
        <nav className="nav">
          <Link to="/courses" className="nav-link">
            <FaBook /> Курсы
          </Link>
          
          {user ? (
            <>
              <Link to="/applications" className="nav-link">
                <FaClipboardList /> Мои заявки
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="nav-link">
                  <FaUserShield /> Админ
                </Link>
              )}
              <span className="user-name">{user.fullName}</span>
              <button onClick={logout} className="btn btn-secondary">
                <FaSignOutAlt /> Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                <FaSignInAlt /> Вход
              </Link>
              <Link to="/register" className="btn btn-primary">
                <FaUserPlus /> Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}



