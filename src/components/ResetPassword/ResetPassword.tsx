import * as React from 'react'
import * as zxcvbn from 'zxcvbn'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import client from '../../client'
import { css } from 'emotion'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

const FormItem = Form.Item

interface ResetPasswordFormProps
  extends FormComponentProps,
    RouteComponentProps<any> {}

interface ResetPasswordState {
  error?: any
  formSubmitted: boolean
  tokenExpired: boolean
  formSuccess: boolean
  message?: string
}

class NormalResetPasswordForm extends Component<
  ResetPasswordFormProps,
  ResetPasswordState
> {
  public emailInput: Input | null
  public state = {
    formSubmitted: false,
    tokenExpired: false,
    formSuccess: false,
    message: undefined,
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ formSubmitted: true })

        const { token } = this.props.match.params
        const { password } = values

        client
          .service('authManagement')
          .create({
            action: 'resetPwdLong',
            value: { token, password },
          })
          .then(result => {
            this.setState({ formSuccess: true })
          })
          .catch(error => {
            this.setState({ formSubmitted: false })
            const fields: any = {}

            switch (error.code) {
              case 400:
                fields.password = {
                  value: values.password,
                  errors: [new Error(error.message)],
                }

                switch (error.errors.$className) {
                  case 'resetExpired':
                    this.setState({ tokenExpired: true })
                    break

                  default:
                    break
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

  get passwordStrength() {
    const password = this.props.form.getFieldValue('password') || ''
    return password ? zxcvbn(password).score : -1
  }

  get passwordStrengthDescription() {
    const descriptors = ['weak', 'okay', 'good', 'strong', 'stronger']

    return descriptors[this.passwordStrength]
  }

  get passwordStrengthColor() {
    const descriptors = ['#f5222d', '#fa8c16', '#fadb14', '#a0d911', '#52c41a']

    return descriptors[this.passwordStrength]
  }

  public render() {
    const { getFieldDecorator } = this.props.form

    const actionButton = this.state.tokenExpired ? (
      <Link to="/forgot-password">
        <Button size="large" type="default" className={css({ width: '100%' })}>
          Request a new token
        </Button>
      </Link>
    ) : (
      <Button
        size="large"
        type="primary"
        htmlType="submit"
        className={css({ width: '100%' })}
        icon={this.state.formSubmitted ? 'check' : undefined}
        disabled={this.state.formSubmitted || this.state.tokenExpired}
      >
        Reset password
      </Button>
    )

    if (this.state.formSuccess) {
      return (
        <Alert
          type="success"
          message={
            <span>
              You have successfully reset your password, please{' '}
              <Link to="/login">log in</Link> with your new password
            </span>
          }
        />
      )
    }

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={css({
          padding: '40px 40px 0',
          background: '#fff',
          width: '100%',
          maxWidth: '400px',
          margin: '0 1em',
        })}
      >
        <FormItem help={this.state.message}>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please enter a password!' },
              { min: 6 },
              {
                validator: (rule, value, callback) => {
                  if (value && value.length < 6) {
                    return callback()
                  }
                  this.passwordStrength >= 1
                    ? callback()
                    : callback('Password strength must be at least okay')
                },
              },
            ],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={
                <span
                  className={css({
                    userSelect: 'none',
                    color: this.passwordStrengthColor,
                  })}
                >
                  {this.passwordStrengthDescription}
                </span>
              }
              type="password"
              placeholder="New Password"
              disabled={this.state.formSubmitted || this.state.tokenExpired}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirmPassword', {
            rules: [
              { required: true, message: 'Please confirm your password! ' },
              {
                validator: (rule, value, callback) =>
                  value === this.props.form.getFieldValue('password')
                    ? callback()
                    : callback('Passwords must match'),
                message: 'Passwords must match',
              },
            ],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Confirm Password"
              disabled={this.state.formSubmitted || this.state.tokenExpired}
            />,
          )}
        </FormItem>
        <FormItem>{actionButton}</FormItem>
      </Form>
    )
  }
}

export const ResetPasswordForm = Form.create()(NormalResetPasswordForm)
