import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import client from '../../client'
import { css } from 'emotion'
import { Link, Redirect } from 'react-router-dom'
import { Location } from 'history'
const FormItem = Form.Item

interface LoginFormProps extends FormComponentProps {
  location: Location
}

interface LoginState {
  error: any
  formSubmitted: boolean
}

class NormalLoginForm extends Component<LoginFormProps, LoginState> {
  emailInput: Input | null

  public state = {
    formSubmitted: false,
    error: null,
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password } = values
        this.setState({ formSubmitted: true })
        client
          .authenticate({
            strategy: 'local',
            email,
            password,
          })
          .catch(error => {
            const fields: any = {}

            switch (error.code) {
              case 401:
                fields.password = {
                  value: values.password,
                  errors: [
                    new Error(
                      'Sorry, looks like thats the wrong username or password',
                    ),
                  ],
                }
                break

              default:
                break
            }
            this.setState({ error, formSubmitted: false })

            this.props.form.setFields(fields)
          })
      }
    })
  }

  public emitEmpty = () => {
    if (this.state.formSubmitted || !this.emailInput) {
      return
    }

    this.emailInput.focus()
    this.props.form.setFieldsValue({ email: '' })
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    const suffix = this.props.form.getFieldValue('email') ? (
      <Icon type="close-circle" onClick={this.emitEmpty} />
    ) : null

    if (!client.init) {
      return null
    }

    if (client.isAuthenticated) {
      return <Redirect to={from} />
    }

    return (
      <Form
        onSubmit={this.handleSubmit}
        className={css({ padding: '40px 40px 0', background: '#fff' })}
      >
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please enter your email!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              placeholder="Email"
              ref={node => (this.emailInput = node ? node : null)}
              disabled={this.state.formSubmitted}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter your Password!' }],
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
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <Link
            to={{
              pathname: '/forgot-password',
              state: { email: this.props.form.getFieldValue('email') },
            }}
            className={css({ float: 'right' })}
          >
            Forgot password
          </Link>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={css({ width: '100%' })}
            disabled={this.state.formSubmitted}
          >
            Log in
          </Button>
          Or you can <Link to="/register">register</Link>
        </FormItem>
      </Form>
    )
  }
}

export const LoginForm = Form.create()(NormalLoginForm)
