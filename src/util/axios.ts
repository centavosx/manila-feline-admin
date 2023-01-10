import axios, { AxiosError } from 'axios'
import { refreshToken } from '../api'
import Cookies from 'js-cookie'

export const API = axios.create({
  baseURL: process.env.API,
})

export const apiRefreshAuth = axios.create({
  baseURL: process.env.API,
})

export const apiAuth = axios.create({
  baseURL: process.env.API,
})

apiRefreshAuth.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${Cookies.get('refreshToken')}`,
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiAuth.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    let e = error
    const config = error.config as any
    if (e?.response?.status === 401 && !config._retry) {
      config._retry = true
      try {
        const data = await refreshToken()
        apiAuth.defaults.headers.common['Authorization'] = data.accessToken
        return apiAuth(config)
      } catch (err) {
        e = err as AxiosError
      }
    }
    if (e?.response?.status === 401) {
      Cookies.remove('refreshToken')
      localStorage.clear()
    }
    return Promise.reject(e)
  }
)
