import React, { createContext, useCallback, useState, useEffect } from 'react'
import { User } from '../entities'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'

type DataType = {
  data: User | undefined
  refetchToken: () => void
  logout: () => Promise<void>
}

export const DataContext = createContext<DataType>({} as DataType)

export const DataProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage?.getItem('accessToken') : null
  )
  const user: User | undefined = !!token ? jwt_decode(token) : undefined
  const data: User | undefined = user

  const refetchToken = () => {
    setToken(
      typeof window !== 'undefined'
        ? localStorage?.getItem('accessToken')
        : null
    )
  }

  const logout = useCallback(async () => {
    await new Promise((resolve) => {
      const cookie = document.cookie.split(';')
      cookie.forEach((data) => {
        Cookies.remove(data.split('=')[0].trim())
      })
      resolve(localStorage.clear())
    })
    refetchToken()
  }, [])

  const provider: DataType = {
    data,
    refetchToken,
    logout,
  }

  return (
    <DataContext.Provider value={provider}>{children}</DataContext.Provider>
  )
}
