import { renderHook } from '@testing-library/react-hooks'
import { useFetch } from './useFetch'

const fetcherCreator = () => {
  let resolve
  let reject
  const promise = new Promise((resolveInner, rejectInner) => {
    resolve = resolveInner
    reject = rejectInner
  })
  return { fetcher: () => promise, resolve, reject }
}

test('should load data properly', async () => {
  const processResponse = jest.fn(({ id }) => id)
  const { fetcher, resolve } = fetcherCreator()
  const { result, waitForNextUpdate } = renderHook(() => useFetch({
    initData: [],
    fetcher,
    processResponse,
  }))

  expect(result.current).toEqual({ loading: true, data: [], error: false, loaded: false })
  resolve({ id: 'test'  })
  await waitForNextUpdate()

  expect(processResponse.mock.calls.length).toBe(1)
  expect(processResponse.mock.calls[0][0]).toEqual({ id: 'test'  })
  expect(result.current).toEqual({ loading: false, data: 'test', error: false, loaded: true })
})

test('should handle error properly', async () => {
  const processError = jest.fn(({ message }) => message)
  const { fetcher, reject } = fetcherCreator()
  const { result, waitForNextUpdate } = renderHook(() => useFetch({
    initData: { init: true },
    fetcher,
    processError,
  }))

  expect(result.current).toEqual({ loading: true, data: { init: true }, error: false, loaded: false })
  reject({ message: 'error text'  })
  await waitForNextUpdate()

  expect(processError.mock.calls.length).toBe(1)
  expect(result.current).toEqual({ loading: false, data: { init: true }, error: 'error text', loaded: true })
})

