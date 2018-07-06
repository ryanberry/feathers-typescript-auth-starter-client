import * as React from 'react'
import { Component, FormEvent } from 'react'
import { Form, Modal, Input, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { css } from 'emotion'

const { Item: FormItem } = Form

export const ConfirmPasswordModal = Form.create()(
  class extends Component<
    FormComponentProps & {
      visible: boolean
      onCancel: () => any
      onConfirm: (password: string) => any
    }
  > {
    render() {
      const { visible, onCancel, onConfirm, form } = this.props
      const { getFieldDecorator } = form

      const onSubmit = (e: FormEvent) => {
        e.preventDefault()

        form.validateFields((err, values) => {
          if (!err) {
            const { password } = values
            onConfirm(password)
            form.resetFields()
          }
        })
      }

      return (
        <Modal
          visible={visible}
          title={null}
          maskClosable={false}
          closable={false}
          okText="Confirm"
          onCancel={onCancel}
          onOk={onSubmit}
          wrapClassName={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
          className={css({ top: 0 })}
        >
          <Form layout="vertical" onSubmit={onSubmit} hideRequiredMark={true}>
            <FormItem style={{ margin: '0' }} label="Confirm current password">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: `Please enter your current password`,
                  },
                ],
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />,
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  },
)
