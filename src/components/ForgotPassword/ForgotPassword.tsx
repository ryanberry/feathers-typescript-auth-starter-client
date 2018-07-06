import * as React from 'react'
import { Component, FormEvent, MouseEvent } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import client from '../../client'
import { css } from 'emotion'
import { Link, RouteComponentProps } from 'react-router-dom'
const FormItem = Form.Item

interface ForgotPasswordFormProps
  extends FormComponentProps,
    RouteComponentProps<any> {}

interface ForgotPasswordState {
  email?: string
  error?: any
  userNotVerified: boolean
  formSubmitted: boolean
  verificationSubmitted: boolean
  message?: string
}

class NormalForgotPasswordForm extends Component<
  ForgotPasswordFormProps,
  ForgotPasswordState
> {
  state = {
    userNotVerified: false,
    formSubmitted: false,
    verificationSubmitted: false,
    message: undefined,
  }

  componentDidMount() {
    const { email } = this.props.location.state || { email: null }
    this.props.form.setFieldsValue({ email })
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ formSubmitted: true })
        const { email } = values
        client
          .service('authManagement')
          .create({
            action: 'sendResetPwd',
            value: { email },
          })
          .then(result =>
            this.setState({
              message: 'Check your email for a link to reset your password',
            }),
          )
          .catch(error => {
            this.setState({ formSubmitted: false })
            const fields: any = {}

            switch (error.code) {
              case 400:
                fields.email = {
                  value: values.email,
                  errors: [new Error(error.message)],
                }
                if (error.errors.$className === 'isVerified') {
                  this.setState({ userNotVerified: true })
                }
                break

              default:
                this.setState({ error })
                break
            }

            this.props.form.setFields(fields)
          })
      }
    })
  }

  public resendVerification = (e: MouseEvent) => {
    e.preventDefault()

    this.setState({ verificationSubmitted: true })
    const email = this.props.form.getFieldValue('email')

    client
      .service('authManagement')
      .create({
        action: 'resendVerifySignup',
        value: { email },
      })
      .then(() => this.props.form.validateFields())
      .then(() => this.setState({ formSubmitted: false }))
      .then(() =>
        this.setState({ message: 'Check your email for a verification link' }),
      )
  }

  public emitEmpty = () => {
    if (this.state.verificationSubmitted || this.state.formSubmitted) {
      return
    }

    this.props.form.setFieldsValue({ email: '' })
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    const suffix = this.props.form.getFieldValue('email') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={css({ padding: '40px 40px 0', background: '#fff' })}
      >
        <FormItem help={this.state.message}>
          {getFieldDecorator('email', {
            validateTrigger: [],
            rules: [
              { required: true, message: 'Enter your email!' },
              {
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: `That doesn't look like a valid email`,
              },
            ],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              placeholder="Email"
              disabled={
                this.state.verificationSubmitted || this.state.formSubmitted
              }
            />,
          )}
        </FormItem>
        <FormItem>
          {this.state.userNotVerified && (
            <Button
              onClick={this.resendVerification}
              size="large"
              type="primary"
              className={css({ width: '100%' })}
              icon={this.state.verificationSubmitted ? 'check' : undefined}
              disabled={this.state.verificationSubmitted}
            >
              Resend verification email
            </Button>
          )}
          {!this.state.userNotVerified && (
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={css({ width: '100%' })}
              icon={this.state.formSubmitted ? 'check' : undefined}
              disabled={this.state.formSubmitted}
            >
              Send reset instructions
            </Button>
          )}
          or you can <Link to="/login">login</Link>
        </FormItem>
      </Form>
    )
  }
}

export const ForgotPasswordForm = Form.create()(NormalForgotPasswordForm)
