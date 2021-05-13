import * as R from 'ramda'
import { useState, useMemo, useEffect, useRef } from 'react'

export const useFetch = (
  {
    initData = null,
    fetcher,
    processError,
    processResponse,
    applyLast,
  },
  payload,
  triggers = [],
) => {
  const lastRequest = useRef(null)
  const initialState = useMemo(() => ({
    loading: true,
    loaded: false,
    error: false,
    data: initData,
  }), [initData])

  const [{ loading, loaded, error, data }, setState] = useState(initialState)

  useEffect(
    () => {
      const reqId = Date.now()
      lastRequest.current = reqId
      setState(R.mergeLeft({ loading: true }))
      fetcher(payload)
        .then(response => {
          if (applyLast && reqId !== lastRequest.current) {
            return
          }
          const newData = processResponse ? processResponse(response, payload, data) : response.body
          setState({ loading: false, error: false, data: newData, loaded: true })
        })
        .catch(error => {
          if (applyLast && reqId !== lastRequest.current) {
            return
          }
          const msg = processError ? processError(error, payload, data) : error
          setState(R.mergeLeft({ loading: false, error: msg, loaded: true }))
        })
    },
    // eslint-disable-next-line
    triggers
  )

  return { loading, data, error, loaded }
}
