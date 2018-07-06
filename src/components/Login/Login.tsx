import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { auth } from '../../store/actions/auth'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { Location } from 'history'
import { ConnectedReduxProps } from '../../store'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
const FormItem = Form.Item

interface LoginFormProps extends FormComponentProps, ConnectedReduxProps {
  location: Location
  auth: any
}

class NormalLoginForm extends Component<LoginFormProps> {
  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.auth.isError !== null &&
      !isEqual(nextProps.auth.isError, this.props.auth.isError)
    ) {
      const { code, className } = nextProps.auth.isError

      const fields: any = {}

      switch (code) {
        case 401:
          switch (className) {
            case 'invalid-login':
              fields.password = {
                value: this.props.form.getFieldValue('password'),
                errors: [
                  new Error(
                    'Whoops! Looks like thats the wrong username or password',
                  ),
                ],
              }
              this.props.form.setFields(fields)
              break
            default:
              break
          }
          break
        default:
          break
      }
    }
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    this.props.form.validateFields((err, values: any) => {
      if (!err) {
        const { email, password } = values

        this.props.dispatch(
          auth.authenticate({
            strategy: 'local',
            email,
            password,
          }),
        )
      }
    })
  }

  public emitEmpty = () => {
    if (this.props.auth.isLoading) {
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
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Enter your email!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              placeholder="Email"
              autoFocus
              disabled={this.props.auth.isLoading}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Enter your Password!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              disabled={this.props.auth.isLoading}
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
            disabled={this.props.auth.isLoading}
          >
            Log in
          </Button>
          Or you can <Link to="/register">register</Link>
        </FormItem>
      </Form>
    )
  }
}

const mapStateToProps = (state: any) => {
  return { auth: state.auth }
}

export const LoginForm = connect(mapStateToProps)(
  Form.create()(NormalLoginForm),
)
