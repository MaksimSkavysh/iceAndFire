import * as R from 'ramda'
import _debounce from 'lodash/debounce'
import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Space, Table, Input, Radio } from 'antd'

import { HOUSE_ROUTE } from 'constants/routes'
import { EMPTY_ARRAY, EMPTY_OBJECT } from 'constants/frozen'
import { getApiData, getLastPageFromHeaders } from 'utils/api'
import { useFetch } from 'hooks/useFetch'
import { Pagination } from 'components/Pagination'

const columns = [
  {
    title: 'Character',
    key:'character',
    render: ({ aliases, name }) => {
      const filtered = aliases.filter(R.identity)
      return <>{name && <b>{name}{filtered.length > 0 && ', '}</b>}{filtered.join(', ')}</>
    }
  },
  {
    title: 'Alive',
    key: 'alive',
    render: ({ born, died }) => {
      if (!died) {
        return 'Yes'
      }
      const postfix = born ? `, died at ${died - born} years old` : ''
      return 'No' + postfix
    },
  },
  {
    title: 'Gender',
    key: 'gender',
    dataIndex: 'gender',
  },
  {
    title: 'Culture',
    key: 'culture',
    dataIndex: 'culture',
  },
  {
    title: 'Allegiances',
    key: 'allegiances',
    dataIndex: 'allegiances',
    render: (ids) => ids.map(id => <Link key={id} to={HOUSE_ROUTE.replace(':houseId', id)}>House {id} </Link>)
  },
  {
    title: '# of Books',
    key: 'books',
    dataIndex: 'books',
    width: 150,
    render: R.length,
  },
]

const INITIAL_PAGE = 1
const dateRegex = /in (\d+)/i
const parseDate = (date) => date ? dateRegex.exec(date)?.[1] : date
const blankValue = value => value || 'Unknown'
const tableScroll = { y: 500 }

const Characters = () => {
  const [page, setPage] = useState(INITIAL_PAGE)
  const [pageSize, setPageSize] = useState(50)
  const [gender, setGender] = useState('')
  const [culture, setCulture] = useState('')
  const onNameChange = useMemo(() => _debounce(({ target }) => {
    setPage(INITIAL_PAGE)
    setCulture(target.value)
  }, 1000), [])
  const onChangeGender = useCallback(({ target }) => {
    setPage(INITIAL_PAGE)
    setGender(target.value)
  }, [])
  const changePageSize = useCallback((newSize) => {
    setPage(INITIAL_PAGE)
    setPageSize(newSize)
  }, [])
  const { loading, data: { last, data = EMPTY_ARRAY } } = useFetch({
    initData: EMPTY_OBJECT,
    applyLast: true,
    fetcher: () => {
      const url = `characters?page=${page}&pageSize=${pageSize}&gender=${gender}&culture=${culture}`
      return getApiData({ url })
    },
    processResponse: ({ body, response }) => {
      return {
        last: getLastPageFromHeaders(response),
        data: body.map(R.evolve({
          culture: blankValue,
          gender: blankValue,
          born: parseDate,
          died: parseDate,
          allegiances: R.map(R.compose(
            R.last,
            R.split('/'),
          ))
        }))
      }
    },
  }, null, [page, pageSize, gender, culture])

  return (
    <div>
      <Space>
        Culture Filter:
        <Input placeholder="Type culture to search" onChange={onNameChange} />
        Gender filter:
        <Radio.Group onChange={onChangeGender} value={gender}>
          <Radio value="">Any</Radio>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Radio.Group>
      </Space>
      <Table
        sticky
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={tableScroll}
        pagination={false}
        rowKey="url"
      />
      <Pagination
        current={page}
        last={last}
        onChange={setPage}
        pageSize={pageSize}
        changePageSize={changePageSize}
        disabled={loading}
      />
    </div>
  )
}

export default React.memo(Characters)
