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
    response = await apiAuth.get('/user/' + id, {})
  } else {
    response = await apiAuth.get('/user/search', {
      params: {
        email,
      },
    })
  }
  return response
}

export const updateRole = async (data: CreateUserDto) => {
  const response = await apiAuth.put('/user/update-role', data)
  return response
}

export const deleteRole = async (data: { ids: string[] }, role: Roles) => {
  const response = await apiAuth.patch(`/user/remove-role`, data, {
    params: {
      role,
    },
  })
  return response
}
