import axios from 'axios'

const api = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Retry only when the request never reached the app — network failure or a
// gateway error (502/503/504)
api.interceptors.response.use(undefined, async (error) => {
  const config = error.config
  if (!config) return Promise.reject(error)

  const retriable = !error.response || [502, 503, 504].includes(error.response.status)
  config.__retryCount = config.__retryCount || 0

  if (retriable && config.__retryCount < 3) {
    config.__retryCount++
    await new Promise((resolve) => setTimeout(resolve, 2000 * config.__retryCount))
    return api(config)
  }

  return Promise.reject(error)
})

export default api