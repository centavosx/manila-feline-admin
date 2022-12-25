import { useState, useCallback, useEffect } from 'react'
import { AxiosResponse } from 'axios'
import { Type } from 'typescript'

export const useApi = (api: () => any) => {
  const [data, setData] = useState<any>()
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [error, setError] = useState<any | undefined>(undefined)

  const call = useCallback(async () => {
    try {
      const response = await api()
      setData(response?.data)
    } catch (e) {
      setError(e)
    } finally {
      setIsFetching(false)
    }
  }, [setData, api, setIsFetching])

  const refetch = useCallback(() => {
    setIsFetching(true)
  }, [setIsFetching])

  useEffect(() => {
    if (isFetching) {
      setError(undefined)
      call()
    }
  }, [isFetching, call, setError])

  return { data, isFetching, refetch, error }
}
