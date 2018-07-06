import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Icon, Input, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { auth } from '../../../store/actions/auth'
import { services } from '../../../store/actions/services'
import { ConnectedReduxProps } from '../../../store'
const FormItem = Form.Item
import {
  PasswordStrength,
  PasswordStrengthRules,
} from '../../PasswordStrength/PasswordStrength'
import { ConfirmPasswordModal } from './ConfirmPassword'

interface AccountFormProps extends FormComponentProps, ConnectedReduxProps {
  auth: any
  users: any
}

interface AccountFormState {
  passwordModalVisible: boolean
  isSaving: boolean
}

class NormalAccountForm extends Component<AccountFormProps, AccountFormState> {
  state = {
    passwordModalVisible: false,
    isSaving: false,
  }

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

    const { form, dispatch } = this.props
    const { users, authManagement } = services

    const afterSave = () =>
      setTimeout(
        () =>
          (dispatch(auth.authenticate({})) as any).then(() =>
            this.setState({ isSaving: false }, () =>
              this.forceUpdate(() =>
                notification.success({
                  message: 'Saved',
                  description: 'Your details were updated',
                }),
              ),
            ),
          ),
        500,
      )

    form.validateFields((err, values) => {
      if (!err) {
        const actions: Array<
          (password?: string) => Promise<{ action: any; value: any }>
        > = []

        if (form.isFieldTouched('displayName')) {
          const { displayName } = values
          this.setState({ isSaving: true })

          dispatch(
            users.patch(this.props.auth.user._id, {
              displayName,
            }),
          ).then(afterSave)
        }

        if (form.isFieldTouched('email')) {
          const { email } = values
          this.setState({ isSaving: true })

          actions.push((password: string) =>
            dispatch(
              authManagement.create({
                action: 'identityChange',
                value: {
                  user: { email: this.props.auth.user.email },
                  password,
                  changes: { email },
                },
              }),
            ),
          )
        }

        if (form.isFieldTouched('newPassword')) {
          const { newPassword } = values
          this.setState({ isSaving: true })

          actions.push((oldPassword: string) =>
            dispatch(
              authManagement.create({
                action: 'passwordChange',
                value: {
                  user: { email: this.props.auth.user.email },
                  oldPassword,
                  password: newPassword,
                },
              }),
            ),
          )
        }

        if (actions.length > 0) {
          this.requestPassword()
            .then(password => actions.forEach(action => action(password)))
            .then(afterSave)
            .catch((error: Error) =>
              notification.error({
                message: 'Whoops!',
                description: error.message,
                duration: 12,
              }),
            )
        }
      }
    })
  }

  requestPassword(): Promise<string> {
    return new Promise(resolve => {
      this.onPasswordConfirm = password => {
        this.setState({ passwordModalVisible: false })
        resolve(password)
      }
      this.setState({ passwordModalVisible: true })
    })
  }

  disableField(): boolean {
    return this.state.isSaving
  }

  onPasswordConfirm: (password: string) => any

  public render() {
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 12 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 24,
          offset: 0,
        },
        md: {
          span: 12,
          offset: 6,
        },
      },
    }

    const onCancel = () => {
      this.setState({ passwordModalVisible: false })
    }

    return (
      <React.Fragment>
        <ConfirmPasswordModal
          visible={this.state.passwordModalVisible}
          onCancel={onCancel}
          onConfirm={this.onPasswordConfirm}
        />
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('displayName', {
              rules: [{ required: true, message: `We need a name for you!` }],
            })(
              <Input
                size="large"
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="name"
                disabled={this.disableField()}
              />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Email"
            help={
              this.props.auth.user.verifyChanges
                ? 'Pending changes, check your email to verify'
                : ''
            }
          >
            {getFieldDecorator('email', {
              rules: [{ required: true, message: `Email can't be empty!` }],
            })(
              <Input
                size="large"
                prefix={
                  <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
                disabled={this.disableField()}
              />,
            )}
          </FormItem>
          <FormItem
            {...tailFormItemLayout}
            style={{ paddingTop: '20px', marginBottom: '10px' }}
          >
            <h3>Change Password</h3>
          </FormItem>
          <FormItem {...formItemLayout} label="New Password">
            {getFieldDecorator('newPassword', {
              rules: [...PasswordStrengthRules],
            })(
              <PasswordStrength
                size="large"
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="New Password"
                disabled={this.disableField()}
                autoComplete="new-password"
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Confirm New Password">
            {getFieldDecorator('confirmPassword', {
              rules: [
                {
                  validator: (rule, value, callback) =>
                    value === this.props.form.getFieldValue('newPassword')
                      ? callback()
                      : callback('Passwords must match'),
                  message: 'Passwords must match',
                },
              ],
            })(
              <Input
                size="large"
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Confirm New Password"
                disabled={this.disableField()}
              />,
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={this.disableField()}
              loading={this.disableField()}
            >
              Save
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    auth: state.auth,
    users: state.users,
  }
}

const mapPropsToFields = (props: any) => {
  return {
    displayName: Form.createFormField({
      value: props.auth.user.displayName,
    }),
    email: Form.createFormField({
      value: props.auth.user.email,
    }),
  }
}

export const AccountForm = connect(mapStateToProps)(
  Form.create({ mapPropsToFields })(NormalAccountForm),
)
