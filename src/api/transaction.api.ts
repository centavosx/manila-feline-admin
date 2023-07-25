import { CreateProductDto, CreateServiceDto } from 'dto'
import { apiAuth } from '../util'

export const getAllTransaction = async (
  page?: number,
  limit?: number,
  other?: any
) => {
  const response = await apiAuth.get('/transaction', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const getTransaction = async (id: string) => {
  const response = await apiAuth.get('/transaction/' + id)
  return response
}

// export const getProductReview = async (id: string) => {
//   const response = await apiAuth.get('/product/' + id + '/review')
//   return response
// }

// export const addProduct = async (data: CreateProductDto) => {
//   const response = await apiAuth.post('/product', data)
//   return response
// }

// export const updateProduct = async (id: string, data: CreateProductDto) => {
//   const response = await apiAuth.patch('/product/' + id, data)
//   return response
// }

// export const deleteService = async (data: { ids: string[] }) => {
//   const response = await apiAuth.post(`/service/delete`, data)
//   return response
// }

// export const searchService = async (search: string) => {
//   const response = await apiAuth.get(`/service/search`, {
//     params: {
//       search,
//     },
//   })
//   return response
// }
