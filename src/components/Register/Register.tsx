import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { css } from 'emotion'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { services } from '../../store/actions/services'
import { ConnectedReduxProps } from '../../store'
const FormItem = Form.Item
import {
  PasswordStrength,
  PasswordStrengthRules,
} from '../PasswordStrength/PasswordStrength'

interface RegisterFormProps extends FormComponentProps, ConnectedReduxProps {
  users: any
}

class NormalRegisterForm extends Component<RegisterFormProps> {
  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.users.isError !== null &&
      !isEqual(nextProps.users.isError, this.props.users.isError)
    ) {
      const { code, errors } = nextProps.users.isError

      const fields: any = {}

      if (code === 409) {
        fields.email = {
          value: this.props.form.getFieldValue('email'),
          errors: [
            new Error(
              `Oops, looks like ${
                errors.email
              } is already registered, login instead`,
            ),
          ],
        }
        this.props.form.setFields(fields)
      }
    }
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password, displayName } = values

        this.props.dispatch(
          services.users.create({
            email,
            password,
            displayName,
          }),
        )
      }
    })
  }

  disableField(): boolean {
    return (
      this.props.users.isLoading ||
      (this.props.users.isFinished && !this.props.users.isError)
    )
  }

  public render() {
    const { getFieldDecorator } = this.props.form

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
        <FormItem>
          {getFieldDecorator('displayName', {
            rules: [{ required: true, message: 'Please enter your name!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="name"
              disabled={this.disableField()}
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
              disabled={this.disableField()}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Please enter a Password!' },
              ...PasswordStrengthRules,
            ],
          })(
            <PasswordStrength
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              disabled={this.disableField()}
            />,
          )}
        </FormItem>
        <FormItem>
          {this.props.users.data && !this.props.users.isError ? (
            <Alert message="Successfully registered, check your email!" />
          ) : (
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className={css({ width: '100%' })}
              disabled={this.disableField()}
            >
              Sign up
            </Button>
          )}
          or <Link to="/login">login</Link>
        </FormItem>
      </Form>
    )
  }
}

const mapStateToProps = (state: any) => {
  return { users: state.users }
}

export const RegisterForm = connect(mapStateToProps)(
  Form.create()(NormalRegisterForm),
)
