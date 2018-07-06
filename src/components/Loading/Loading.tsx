import * as React from 'react'
import { Component } from 'react'
import { Spin, Icon } from 'antd'

export class Loading extends Component {
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
    return <Spin indicator={antIcon} />
  }
}
