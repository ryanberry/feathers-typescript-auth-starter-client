import * as React from 'react'
import { Component } from 'react'
import { Button, Layout, Icon } from 'antd'
import { css } from 'emotion'
import { connect } from 'react-redux'
import { ConnectedReduxProps } from '../../../store'
import { auth } from '../../../store/actions/auth'

class NormalHeader extends Component<
  { isSignedIn: boolean } & ConnectedReduxProps
> {
  render() {
    const { dispatch, isSignedIn } = this.props

    const handleLogout = () => {
      dispatch(auth.logout())
    }

    return (
      <Layout.Header
        className={css({
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '30px 50px',
        })}
      >
        {isSignedIn && (
          <Button onClick={handleLogout} className={css({})} type="ghost">
            Logout <Icon type="logout" />
          </Button>
        )}
      </Layout.Header>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isSignedIn: state.auth.isSignedIn,
})

export const Header = connect(mapStateToProps)(NormalHeader)
