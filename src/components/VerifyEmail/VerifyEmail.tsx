import * as React from 'react'
import { Component, MouseEvent } from 'react'
import { FormComponentProps } from 'antd/lib/form'
import client from '../../client'
import { RouteComponentProps } from 'react-router-dom'
import { Icon, Alert } from 'antd'

interface VerifyEmailProps
  extends FormComponentProps,
    RouteComponentProps<any> {}

interface VerifyEmailState {
  verificationSubmitted: boolean
  verificationSuccess: boolean
  user: any
  message?: {
    type: 'success' | 'info' | 'warning' | 'error' | undefined
    title: string
    description: string
  } | null
}

export class VerifyEmail extends Component<VerifyEmailProps, VerifyEmailState> {
  state: VerifyEmailState = {
    verificationSubmitted: false,
    verificationSuccess: false,
    user: null,
    message: null,
  }

  componentDidMount() {
    this.sendVerificationToken()
  }

  public sendVerificationToken = () => {
    const { token } = this.props.match.params

    this.setState({ verificationSubmitted: true })

    client
      .service('authManagement')
      .create({
        action: 'verifySignupLong',
        value: token,
      })
      .then(response =>
        this.setState({
          verificationSuccess: true,
          user: response._doc,
          message: {
            type: 'success',
            title: 'Success',
            description: `Thank you ${
              response._doc.displayName
            }, your email address has been verified.`,
          },
        }),
      )
      .catch(response =>
        this.setState({
          verificationSuccess: false,
          user: response._doc,
          message: {
            type: 'error',
            title: 'Whoops!',
            description: `Sorry your token has expired or the user you're attempting to verify does not exist`,
          },
        }),
      )
  }

  public onClose = (event: MouseEvent): void => {
    this.props.history.push('/login')
  }

  public render() {
    if (this.state.message) {
      return (
        <Alert
          showIcon
          message={this.state.message.title}
          description={this.state.message.description}
          type={this.state.message.type}
          closable
          onClose={this.onClose}
        />
      )
    } else {
      return <Icon type="loading" style={{ fontSize: 24 }} spin />
    }
  }
}
