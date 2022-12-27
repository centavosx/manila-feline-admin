import React, { useCallback } from 'react'
import { Flex } from 'rebass'
import { AiOutlineRollback } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { Text } from 'components/text'

export const BackButton = ({ children }: { children: string }) => {
  const { back, replace } = useRouter()

  const goBack = useCallback(() => {
    if (window.history.length > 2) return back()
    return replace('/dashboard')
  }, [back, replace])

  return (
    <Flex sx={{ gap: 10, alignItems: 'center' }}>
      <AiOutlineRollback
        onClick={goBack}
        size={24}
        style={{ cursor: 'pointer' }}
      />

      {children}
    </Flex>
  )
}
