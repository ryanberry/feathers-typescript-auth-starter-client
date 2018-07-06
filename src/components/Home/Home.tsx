import * as React from 'react'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

import { connect } from 'react-redux'
import { ConnectedReduxProps } from '../../store'

interface HomeProps extends ConnectedReduxProps {
  auth: any
}

class Home extends Component<HomeProps> {
  render() {
    if (this.props.auth.isSignedIn) {
      return (
        <Link to="/dash">
          <Button type="primary">Dash</Button>
        </Link>
      )
    } else {
      return (
        <Link to="/login">
          <Button type="primary">Login</Button>
        </Link>
      )
    }
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)
