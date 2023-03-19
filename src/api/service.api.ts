import { CreateServiceDto } from 'dto'
import { apiAuth } from '../util'

export const getAllService = async (
  page?: number,
  limit?: number,
  other?: any
) => {
  const response = await apiAuth.get('/service', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const addService = async (data: CreateServiceDto) => {
  const response = await apiAuth.post('/service', data)
  return response
}

export const updateService = async (data: {
  id: string
  name: string
  description: string
}) => {
  const response = await apiAuth.patch('/service', data)
  return response
}

export const deleteService = async (data: { ids: string[] }) => {
  const response = await apiAuth.post(`/service/delete`, data)
  return response
}

export const searchService = async (search: string) => {
  const response = await apiAuth.get(`/service/search`, {
    params: {
      search,
    },
  })
  return response
}
