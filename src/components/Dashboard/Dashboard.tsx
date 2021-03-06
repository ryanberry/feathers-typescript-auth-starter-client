import * as React from 'react'
import { Component } from 'react'
import { Icon, Layout, Menu, Button } from 'antd'
import client from '../../client'
// import client from '../../client'
// import { css } from 'emotion'
// import { Link } from 'react-router-dom'

const { SubMenu } = Menu
const { Content, Sider } = Layout

interface DashboardProps {}

interface LoginState {
  error?: any
  users?: any[]
}

export class Dashboard extends Component<DashboardProps, LoginState> {
  state = {
    error: null,
    users: [],
  }
  public logout() {
    client
      .logout()
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  componentDidMount() {
    client
      .service('users')
      .find()
      .then((users: any) => this.setState({ users: users.data }))
  }

  public render() {
    return (
      <Layout
        style={{ padding: '24px 0', background: '#fff', maxWidth: '80vw' }}
      >
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />subnav 1
                </span>
              }
            >
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="laptop" />subnav 2
                </span>
              }
            >
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="notification" />subnav 3
                </span>
              }
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <Button icon="logout" onClick={this.logout}>
            Logout
          </Button>
        </Content>
      </Layout>
    )
  }
}
