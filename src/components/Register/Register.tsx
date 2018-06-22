import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, Alert, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import client from '../../client'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
const FormItem = Form.Item

interface RegisterFormProps extends FormComponentProps {}

interface RegisterFormState {
  error: any
  formSubmitted: boolean
  registrationSuccess: boolean
}

class NormalRegisterForm extends Component<
  RegisterFormProps,
  RegisterFormState
> {
  public state = {
    error: { message: null, className: null, code: null, name: null },
    registrationSuccess: false,
    formSubmitted: false,
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.setState({ error: { message: null } })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ formSubmitted: true })
        const { email, password, displayName } = values
        client
          .service('users')
          .create({
            email,
            password,
            displayName,
          })
          .then(user => {
            message.success(
              'Successfully registered, please check your email',
              1000,
            )
            this.setState({ registrationSuccess: true })
          })
          .catch(error => {
            const fields: any = {}

            switch (error.code) {
              case 409:
                fields.email = {
                  value: values.email,
                  errors: [new Error(error.message)],
                }
                break

              default:
                this.setState({ error })
                break
            }

            this.setState({ formSubmitted: false })
            this.props.form.setFields(fields)
          })
      }
    })
  }

  public render() {
    const { getFieldDecorator } = this.props.form

    const alert = this.state.error.message ? (
      <Alert
        message="Whoops!"
        description={this.state.error.message}
        type="error"
        showIcon
        className={css({
          marginBottom: '24px',
        })}
      />
    ) : null

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={css({
          padding: '40px 40px 0',
          background: '#fff',
          maxWidth: '500px',
          width: '100vw',
        })}
      >
        {alert}
        <FormItem>
          {getFieldDecorator('displayName', {
            rules: [{ required: true, message: 'Please enter your name!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="name"
              disabled={this.state.formSubmitted}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter an email!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              disabled={this.state.formSubmitted}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter a Password!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              disabled={this.state.formSubmitted}
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={css({ width: '100%' })}
            disabled={this.state.formSubmitted}
          >
            Sign up
          </Button>
          or <Link to="/login">login</Link>
        </FormItem>
      </Form>
    )
  }
}

export const RegisterForm = Form.create()(NormalRegisterForm)
