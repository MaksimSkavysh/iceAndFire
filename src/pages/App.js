import React from 'react'
import { Layout, Menu } from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import { CHARACTERS_ROUTE, HOUSE_ROUTE } from 'constants/routes'
import { Characters } from 'pages/Characters'
import { House } from 'pages/House'
import styles from './App.module.css'

const App = () => (
  <Router>
    <Layout className={styles.content}>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1"><Link to={CHARACTERS_ROUTE}>Characters</Link></Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content>
        <Switch>
          <Route path={HOUSE_ROUTE}><House /></Route>
          <Route path={CHARACTERS_ROUTE}><Characters /></Route>
        </Switch>
      </Layout.Content>
    </Layout>
  </Router>
)


export default React.memo(App)
