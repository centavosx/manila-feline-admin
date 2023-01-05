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
    if (error?.response?.status !== 401) return Promise.reject(error)
    return refreshToken()
      .then(() => apiAuth(error?.config!))
      .catch((error: AxiosError) => {
        if (error?.response?.status === 401) {
          Cookies.remove('refreshToken')
          localStorage.clear()
        }
        return Promise.reject(error)
      })
  }
)
