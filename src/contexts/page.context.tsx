import React, { createContext, useState, useEffect } from 'react'

import { useUser } from 'hooks'
import { useRouter } from 'next/router'
import { Main } from 'components/main'

export const DataContext = createContext<undefined>(undefined)

export const PageProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const { user } = useUser()
  const { pathname, replace } = useRouter()

  useEffect(() => {
    if (!!user && pathname === '/')
      return () => {
        replace('/dashboard')
      }
    if (!user && pathname !== '/')
      return () => {
        replace('/')
      }
  }, [user, pathname, replace])

  return (
    <DataContext.Provider value={undefined}>
      <Main isLink={true}>{children}</Main>
    </DataContext.Provider>
  )
}
