import { useState, useCallback, useEffect } from 'react'
import { AxiosResponse } from 'axios'
import { Type } from 'typescript'

export const useApi = (api: () => any) => {
  const [data, setData] = useState<any>()

  const [{ loading, isFetching }, setFetching] = useState<{
    loading: boolean
    isFetching: boolean
  }>({ loading: true, isFetching: true })
  const [error, setError] = useState<any | undefined>(undefined)

  const call = useCallback(async () => {
    try {
      const response = await api()
      setData(response?.data)
    } catch (e) {
      setError(e)
    } finally {
      setFetching((d) => ({ ...d, isFetching: false }))
    }
  }, [setData, api, setFetching])

  const refetch = useCallback(() => {
    setFetching(() => ({ loading: true, isFetching: true }))
  }, [setFetching])

  useEffect(() => {
    if (isFetching && loading) {
      setFetching((d) => ({ ...d, loading: false }))
      setError(undefined)
      call()
    }
  }, [isFetching, loading, call, setError, setFetching])

  return { data, isFetching, refetch, error }
}
