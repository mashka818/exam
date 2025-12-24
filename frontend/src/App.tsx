import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Applications from './pages/Applications'
import CreateApplication from './pages/CreateApplication'
import AdminPanel from './pages/AdminPanel'
import Courses from './pages/Courses'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          
          <Route path="/applications" element={
            <PrivateRoute>
              <Applications />
            </PrivateRoute>
          } />
          
          <Route path="/applications/create" element={
            <PrivateRoute>
              <CreateApplication />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App



