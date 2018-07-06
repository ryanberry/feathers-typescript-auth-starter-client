import * as React from 'react'
import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { css } from 'emotion'
import { Layout } from 'antd'
import {
  UserIsAuthenticated,
  UserIsNotAuthenticated,
} from '../../helpers/privateRoute'

import Home from '../../components/Home/Home'
import { Dashboard } from '../../components/Dashboard/Dashboard'
import { LoginForm } from '../../components/Login/Login'
import { RegisterForm } from '../../components/Register/Register'
import { VerifyIdentity } from '../../components/VerifyIdentity/VerifyIdentity'
import { ForgotPasswordForm } from '../../components/ForgotPassword/ForgotPassword'
import { ResetPasswordForm } from '../../components/ResetPassword/ResetPassword'
import { NotFound } from '../../components/NotFound/NotFound'

const { Content } = Layout

export class AppRouter extends Component {
  centered = css({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  })

  render() {
    return (
      <Router>
        <Content className={this.centered}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/dash"
              component={UserIsAuthenticated(Dashboard as any)}
            />
            <Route
              path="/login"
              component={UserIsNotAuthenticated(LoginForm as any)}
            />
            <Route path="/register" component={RegisterForm} />
            <Route path="/verify/:token" component={VerifyIdentity} />
            <Route path="/forgot-password" component={ForgotPasswordForm} />
            <Route
              path="/reset-password/:token"
              component={ResetPasswordForm}
            />
            <Route component={NotFound} />
          </Switch>
        </Content>
      </Router>
    )
  }
}
