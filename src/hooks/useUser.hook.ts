import { useContext, useEffect, useCallback } from 'react'
import { DataContext } from '../contexts'

import { me } from '../api'

export const useUser = () => {
  const { data, logout, refetchToken } = useContext(DataContext)

  const getMe = async () => {
    await me()
    refetchToken()
  }

  getMe()

  return { data, logout }
}
