import axios from 'axios'

const API_URL = 'http://localhost:3000'
export const BACKEND_URL = API_URL

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
}

export const users = {
  getProfile: () => api.get('/users/profile'),
}

export const courses = {
  getAll: () => api.get('/courses'),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
}

export const applications = {
  create: (data: any) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  getAll: () => api.get('/applications'),
  updateStatus: (id: string, status: string) => 
    api.patch(`/applications/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/applications/${id}`),
}

export const reviews = {
  create: (data: any) => api.post('/reviews', data),
  getAll: () => api.get('/reviews'),
  getMy: () => api.get('/reviews/my'),
  getLatest: (limit: number) => api.get(`/reviews/latest/${limit}`),
}

export default api



