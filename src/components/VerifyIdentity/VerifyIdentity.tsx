import * as React from 'react'
import { Component } from 'react'
import { auth } from '../../store/actions/auth'
import { services } from '../../store/actions/services'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Icon, Button } from 'antd'
import Result from 'ant-design-pro/lib/Result'
import { connect } from 'react-redux'
import { ConnectedReduxProps } from '../../store'

interface VerifyIdentityProps
  extends RouteComponentProps<any>,
    ConnectedReduxProps {}

interface VerifyIdentityState {
  message?: {
    type: 'success' | 'error'
    title: string
    description: string
  } | null
}

class NormalVerifyIdentity extends Component<
  VerifyIdentityProps,
  VerifyIdentityState
> {
  state: VerifyIdentityState = {
    message: null,
  }

  componentDidMount() {
    this.sendVerificationToken()
  }

  public sendVerificationToken = () => {
    const { token } = this.props.match.params
    const { dispatch } = this.props
    const { authManagement } = services

    dispatch(
      authManagement.create({
        action: 'verifySignupLong',
        value: token,
      }),
    )
      .then(({ value }: any) => {
        this.setState({
          message: {
            type: 'success',
            title: 'Success',
            description: `Thank you ${
              value._doc.displayName
            }, your email address has been verified.`,
          },
        })
        dispatch(auth.authenticate({}))
      })
      .catch(() =>
        this.setState({
          message: {
            type: 'error',
            title: 'Whoops!',
            description: `Sorry your token has expired or the user you're attempting to verify does not exist`,
          },
        }),
      )
  }

  public render() {
    if (this.state.message) {
      return (
        <Result
          title={this.state.message.title}
          description={this.state.message.description}
          type={this.state.message.type}
          actions={
            <Link to="/">
              <Button>Back to home</Button>
            </Link>
          }
        />
      )
    } else {
      return <Icon type="loading" style={{ fontSize: 24 }} spin />
    }
  }
}

export const VerifyIdentity = connect()(NormalVerifyIdentity)
