import { API_URL } from 'constants/env'

const COMMON_HEADERS = {
  method: 'GET',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
}

export async function postApiData(url = '', data = {}) {
  const response = await fetch(url, {
    ...COMMON_HEADERS,
    method: 'POST',
    body: JSON.stringify(data)
  })
  const body = await response.json()
  return { body, response }
}

export async function getApiData ({ url }) {
  const response = await fetch(API_URL + url, COMMON_HEADERS)
  const body = await response.json()
  return { body, response }
}

const headerReg = /page=(\d+)/i
export const getLastPageFromHeaders = (response) => response.headers
  .get('link')
  .split(',')
  .reduce((acc, str) => {
    if (str.includes('rel="last"')) {
      const res = headerReg.exec(str)
      return +res[1]
    }
    return acc
  }, {})

