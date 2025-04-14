import axios from 'axios'
import router from './router'

// Create Axios instance
const instance = axios.create({
  baseURL: 'http://localhost', // adjust if needed
})

// Helper: Check if JWT is expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp < now
  } catch (e) {
    console.warn('Invalid token', e)
    return true // Assume expired if broken
  }
}

// Async interceptor using async/await
instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      const expired = isTokenExpired(token)

      if (expired) {
        localStorage.removeItem('token');
        console.log('Token expired')
        router.push('/login');
        throw new axios.Cancel('Token expired – redirecting to login')
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

export default instance
