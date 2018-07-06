import * as React from 'react'
import { Component } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { AccountForm } from './Account/Account'
import {
  Route,
  Link,
  withRouter,
  RouteComponentProps,
  Switch,
} from 'react-router-dom'
import { RouterState } from 'connected-react-router'
import { ConnectedReduxProps } from '../../store'
import { connect } from 'react-redux'
import { LayoutState } from '../../store/reducers/layout'
import { css } from 'emotion'
import { toggleMenu, collapseMenu } from '../../store/actions/layout'
const { Content, Sider } = Layout
const { Item } = Menu

interface DashboardProps {}

class DashboardComponent extends Component<
  DashboardProps &
    RouterState &
    RouteComponentProps<any> &
    ConnectedReduxProps &
    LayoutState
> {
  public render() {
    const { location, match, menuCollapsed, dispatch } = this.props

    const handletToggleMenu = () => {
      dispatch(toggleMenu())
    }

    const handleCollapseMenu = () => {
      dispatch(collapseMenu())
    }

    return (
      <Layout
        style={{
          padding: '0',
          background: '#fff',
          width: '100%',
          maxWidth: '1000px',
          overflow: 'hidden',
        }}
      >
        <Sider
          breakpoint="sm"
          collapsible
          collapsed={menuCollapsed}
          trigger={null}
          width={200}
          style={{ background: '#fff' }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%' }}
            selectedKeys={[location.pathname]}
            onClick={handleCollapseMenu}
          >
            <Item key={`${match.url}`}>
              <Link to={`${match.url}`}>
                <Icon type="fork" />
                <span>Conditions</span>
              </Link>
            </Item>
            <Item key={`${match.url}/account`}>
              <Link to={`${match.url}/account`}>
                <Icon type="user" />
                <span>Account</span>
              </Link>
            </Item>
          </Menu>
          <a
            onClick={handletToggleMenu}
            className={css({
              position: 'absolute',
              bottom: 0,
              width: '100%',
              lineHeight: '40px',
              textAlign: 'center',
            })}
          >
            <Icon type={menuCollapsed ? 'menu-unfold' : 'menu-fold'} />
          </a>
        </Sider>

        <Content
          style={{
            padding: '40px',
            minHeight: 280,
            minWidth: 'calc(100% - 80px)',
          }}
        >
          <Switch>
            <Route exact path={`${match.url}`} />
            <Route path={`${match.url}/account`} component={AccountForm} />
          </Switch>
        </Content>
      </Layout>
    )
  }
}

const mapStateToProps = (state: any) => state.layout

export const Dashboard = connect(mapStateToProps)(
  withRouter(DashboardComponent),
)
