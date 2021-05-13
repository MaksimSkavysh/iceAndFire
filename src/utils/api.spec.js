import { getApiData } from './api'

beforeEach(() => {
  fetch.resetMocks()
})

it('test',async () => {
  const data = { id: 'testData' }
  fetch.mockResponseOnce(JSON.stringify(data))
  const { body } = await getApiData({ url: '/' })
  expect(body).toEqual(data)
})
