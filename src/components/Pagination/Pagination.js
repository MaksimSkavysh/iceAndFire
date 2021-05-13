import * as R from 'ramda'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Menu } from 'antd'

const Pagination = ({ current, last, onChange, pageSize, changePageSize, disabled }) => {
  const menu = useMemo(() => (
    <Menu>
      <Menu.Item onClick={() => changePageSize(10)}>10/page</Menu.Item>
      <Menu.Item onClick={() => changePageSize(25)}>25/page</Menu.Item>
      <Menu.Item onClick={() => changePageSize(50)}>50/page</Menu.Item>
    </Menu>
  ), [changePageSize])

  return (
    <div>
      <Button disabled={disabled} onClick={() => onChange(1)}>First</Button>
      <Button disabled={disabled} onClick={() => onChange(R.max(current - 1, 1))}>Previous</Button>
      <Button disabled>{current}/{last}</Button>
      <Button disabled={disabled} onClick={() => onChange(R.min(current + 1, last))}>Next</Button>
      <Button disabled={disabled} onClick={() => onChange(last)}>last</Button>
      <Dropdown disabled={disabled} overlay={menu}>
        <Button>{pageSize}/page</Button>
      </Dropdown>
    </div>
  )
}

Pagination.propTypes = {
  current: PropTypes.number,
  last: PropTypes.number,
  onChange: PropTypes.func,
  pageSize: PropTypes.number,
  changePageSize: PropTypes.func,
  disabled: PropTypes.bool,
}

export default React.memo(Pagination)
