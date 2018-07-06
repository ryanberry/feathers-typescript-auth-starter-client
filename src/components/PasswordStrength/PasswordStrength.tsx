import * as React from 'react'
import { Component } from 'react'
import { Input } from 'antd'
import { css } from 'emotion'
import * as zxcvbn from 'zxcvbn'
import { InputProps } from 'antd/lib/input'

interface PasswordStrengthProps {}

export const PasswordStrengthRules = [
  { min: 6, message: 'You must use at least 6 characters' },
  {
    validator: (rule: any, value: any, callback: any) => {
      if (!value || (value && value.length < 6)) {
        return callback()
      }

      zxcvbn(value).score >= 1
        ? callback()
        : callback('Password strength must be at least okay')
    },
  },
]

export class PasswordStrength extends Component<
  PasswordStrengthProps & InputProps
> {
  input: Input | null

  get passwordStrength() {
    const password = this.input ? String(this.input.input.value) : ''
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

  handleChange = () => {
    this.setState({})
  }

  render() {
    return (
      <Input
        suffix={
          !this.props.disabled && (
            <span
              className={css({
                userSelect: 'none',
                color: this.passwordStrengthColor,
              })}
            >
              {this.passwordStrengthDescription}
            </span>
          )
        }
        onChange={this.handleChange}
        type="password"
        ref={ref => (this.input = ref ? ref : null)}
        {...this.props}
      />
    )
  }
}
