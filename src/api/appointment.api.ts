import { AmOrPm, Status } from 'entities'
import { apiAuth } from '../util'

export const getAppointment = async (
  page: number,
  limit: number,
  status: Status,
  time: AmOrPm,
  other?: any
) => {
  const response = await apiAuth.get('/other/appointments', {
    params: {
      page,
      limit,
      status,
      time,
      ...other,
    },
  })
  return response
}
