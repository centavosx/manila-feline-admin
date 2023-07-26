import React, { createContext, useCallback, useState, useEffect } from 'react'
import { User } from '../entities'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { me } from '../api'
import { useRouter } from 'next/navigation'

type DataType = {
  user: User | undefined
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  refetch: (refresh?: boolean) => Promise<unknown>
  logout: () => void
}

export const DataContext = createContext<DataType>({} as DataType)

export const DataProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const { refresh } = useRouter()
  const token = Cookies.get('accessToken')
  const [user, setUser] = useState<User | undefined>(
    !!token ? jwt_decode(token) : undefined
  )

  const getMe = async (reload?: boolean) => {
    setUser(await me())
    if (reload) refresh()
  }

  useEffect(() => {
    getMe()
  }, [token])

  const logout = useCallback(() => {
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    if (!!user) {
      refresh()
    }
  }, [user])

  const provider: DataType = {
    user,
    setUser,
    refetch: getMe,
    logout,
  }

  return (
    <DataContext.Provider value={provider}>{children}</DataContext.Provider>
  )
}
