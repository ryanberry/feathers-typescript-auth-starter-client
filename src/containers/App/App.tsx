import * as React from 'react'
import { Component } from 'react'
import { Layout } from 'antd'
import { css } from 'emotion'
// import GlobalFooter from 'ant-design-pro/lib/GlobalFooter'

import { AppRouter } from '../Router/Router'
import { Header } from './Header/Header'

export class App extends Component {
  public render() {
    return (
      <Layout className={css({ height: '100vh' })}>
        <Header />
        <AppRouter />
        {/* <GlobalFooter
          copyright={`Copyright © ${new Date().getFullYear()} mix-tape.io`}
        /> */}
      </Layout>
    )
  }
}
