import { useContext, useEffect, useCallback } from 'react'
import { DataContext } from '../contexts'

import { me } from '../api'

export const useUser = () => {
  const { user, logout, refetch } = useContext(DataContext)

  // const getMe = async () => {
  //   await me()
  // }

  // getMe()

  return { user, logout, refetch }
}
