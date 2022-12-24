import { API, apiAuth } from '../util'
import { TokenDTO } from 'dto'
import Cookies from 'js-cookie'

export const me = async () => {
  try {
    const response = await apiAuth.get('/user/me')
    return response.data
  } catch {
    return undefined
  }
}

export const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const response = await API.post('/auth', { email, password })

  const { accessToken, refreshToken }: TokenDTO = response.data
  localStorage.setItem('accessToken', accessToken)
  Cookies.set('refreshToken', refreshToken)
}
