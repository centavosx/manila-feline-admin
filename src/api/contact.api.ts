import { TimeSetterProps } from 'components/doctor/availability'
import { CreateUserDto } from 'dto'
import { Roles, User } from 'entities'
import { apiAuth } from '../util'

export const getAllContact = async (
  page: number,
  limit: number,
  other?: any
) => {
  const response = await apiAuth.get('/other/mail', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const deleteMail = async (data: { ids: string[] }) => {
  const response = await apiAuth.patch(`/other/mail`, data)
  return response
}
