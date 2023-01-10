import { AmOrPm, Status } from 'entities'
import { apiAuth } from '../util'

export const getAppointment = async (
  page: number,
  limit: number,
  status?: Status,
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

export const deleteAppointment = async (id: string[]) => {
  const response = await apiAuth.delete('/appointments/', {
    params: {
      id,
    },
  })
  return response
}

export type UpdateAppointmentDto = {
  doctorId?: string
  serviceId?: string
  status?: Status
  time?: AmOrPm
  startDate?: Date | number
  endDate?: Date | number
  date?: Date | number
}

export const updateAppointment = async (
  id: string,
  value: UpdateAppointmentDto
) => {
  const response = await apiAuth.patch('/appointments/' + id, value)
  return response
}

export const newAppointment = async (data: any) => {
  const response = await apiAuth.post('/appointments/', data)
  return response
}
