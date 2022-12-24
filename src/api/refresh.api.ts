import { apiRefreshAuth } from '../util'
import { TokenDTO } from '../dto'
import Cookies from 'js-cookie'
export const refreshToken = async () => {
  const response = await apiRefreshAuth.get('/auth/refresh')

  const { accessToken, refreshToken }: TokenDTO = response.data

  localStorage.setItem('accessToken', accessToken)
  Cookies.set('refreshToken', refreshToken)
}
