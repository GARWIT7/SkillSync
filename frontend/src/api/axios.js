
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})

// Attach access token to every API request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Automatically refresh expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        const response = await axios.post(
          'http://127.0.0.1:8000/api/users/token/refresh/',
          { refresh: refreshToken }
        )

        const newAccessToken = response.data.access

        localStorage.setItem('accessToken', newAccessToken)

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        window.location.href = '/'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
