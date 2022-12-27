import { TimeSetterProps } from 'components/doctor/availability'
import { CreateUserDto } from 'dto'
import { Roles, User } from 'entities'
import { apiAuth } from '../util'

export const getAllUser = async (page: number, limit: number, other: any) => {
  const response = await apiAuth.get('/user', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const getUser = async (id?: string, email?: string) => {
  let response
  if (!!id) {
    response = await apiAuth.get('/user/' + id + '/information', {})
  } else {
    response = await apiAuth.get('/user/search', {
      params: {
        email,
      },
    })
  }
  return response
}

export const updateAvailability = async (id: string, time: TimeSetterProps) => {
  const response = await apiAuth.put(`/user/${id}/availability`, {
    time,
  })
  return response
}

export const addUserService = async (id: string, serviceId: string) => {
  const response = await apiAuth.post(`/user/${id}/service`, {
    id: serviceId,
  })
  return response
}

export const removeService = async (id: string, serviceId: string) => {
  const response = await apiAuth.delete(`/user/${id}/service`, {
    params: {
      id: serviceId,
    },
  })
  return response
}

export const updateRole = async (data: CreateUserDto) => {
  const response = await apiAuth.put('/user/role', data)
  return response
}

export const deleteRole = async (data: { ids: string[] }, role: Roles) => {
  const response = await apiAuth.patch(`/user/role`, data, {
    params: {
      role,
    },
  })
  return response
}
