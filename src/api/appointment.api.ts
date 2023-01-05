import { AmOrPm, Status } from 'entities'
import { apiAuth } from '../util'

export const getAppointment = async (
  page: number,
  limit: number,
  status: Status,
  time?: AmOrPm | null,
  other?: any
) => {
  const response = await apiAuth.get('/appointments', {
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

export const getAppointmentInfo = async (id: string) => {
  const response = await apiAuth.get('/appointments/' + id)
  return response
}

export type UpdateAppointmentDto = {
  doctorId?: string
  serviceId?: string
  status?: Status
  time?: AmOrPm
  startDate?: Date | number
  endDate?: Date | number
}
