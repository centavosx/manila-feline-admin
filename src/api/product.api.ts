import { CreateProductDto, CreateServiceDto } from 'dto'
import { apiAuth } from '../util'

export const getAllProduct = async (
  page?: number,
  limit?: number,
  other?: any
) => {
  const response = await apiAuth.get('/product', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const getProduct = async (id: string) => {
  const response = await apiAuth.get('/product/' + id)
  return response
}

export const getProductReview = async (id: string) => {
  const response = await apiAuth.get('/product/' + id + '/review')
  return response
}

export const addProduct = async (data: CreateProductDto) => {
  const response = await apiAuth.post('/product', data)
  return response
}

export const updateProduct = async (id: string, data: CreateProductDto) => {
  const response = await apiAuth.patch('/product/' + id, data)
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
