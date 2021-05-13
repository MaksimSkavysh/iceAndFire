import React, { useCallback, useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Table, Spin, PageHeader } from 'antd'

import { EMPTY_OBJECT } from 'constants/frozen'
import { CHARACTERS_ROUTE } from 'constants/routes'
import { getApiData } from 'utils/api'
import { useFetch } from 'hooks/useFetch'
import styles from './House.module.css'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Descriptions',
    dataIndex: 'value',
    key: 'value',
  },
]

const House = () => {
  const history = useHistory()
  const goBack = useCallback(() => history.push(CHARACTERS_ROUTE), [history])

  const { houseId } = useParams()
  const { loading, data } = useFetch({
    initData: EMPTY_OBJECT,
    applyLast: true,
    fetcher: () => getApiData({ url: `houses/${houseId}` }),
  }, null, [])

  const dataSource = useMemo(() => [
    { name: 'Name', value: data.name },
    { name: 'Region', value: data.region },
    { name: 'Coat of Arms', value: data.coatOfArms },
    { name: 'Words', value: data.words },
    { name: 'Titles', value: data.titles?.join(', ') },
    { name: 'Seats', value: data.seats?.join(', ') },
    { name: 'Has died out', value: data.diedOut ? 'Yes' : 'No' },
    { name: 'Has overlord', value: data.overlord ? 'Yes' : 'No' },
    { name: 'Number of Cadet Branches', value: data.cadetBranches?.length },
  ], [data])

  if (loading) {
    return <div className={styles.spinnerRoot} ><Spin size="large"/></div>
  }

  return (
    <div>
      <PageHeader
        onBack={goBack}
        title={data.name}
      />
      <Table
        bordered
        rowKey="name"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
      />
    </div>
  )
}

export default React.memo(House)
