import React, { createContext, useState, useEffect, useCallback } from 'react'

import { useUser } from 'hooks'
import { useRouter } from 'next/router'
import { Main } from 'components/main'
import { Roles } from 'entities'
import { Loading } from 'components/loading'

export const DataContext = createContext<undefined>(undefined)

export const PageProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const { user } = useUser()
  const { pathname, replace } = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const redirect = useCallback(
    async (loc: string) => {
      setIsLoading(true)
      await replace(loc)
      setIsLoading(false)
    },
    [setIsLoading]
  )

  useEffect(() => {
    if (pathname === '/reset') {
      setIsLoading(false)
      return
    }
    if (!!user) {
      if (
        !user.verified ||
        !user.roles.some((v) => (v as any).name === Roles.ADMIN)
      ) {
        redirect('/')
        return
      }
      if (pathname === '/') {
        redirect('/dashboard')
        return
      }
      setIsLoading(false)
      return
    }
    redirect('/')
  }, [user, redirect, setIsLoading])

  if (isLoading) return <Loading />

  return (
    <DataContext.Provider value={undefined}>
      <Main isLink={true}>{children}</Main>
    </DataContext.Provider>
  )
}
