import * as React from 'react'
import { Component } from 'react'
import { Paginated } from '@feathersjs/feathers'
import client from '../../client'
import { css } from 'emotion'
import { Layout, Button } from 'antd'
const { Content } = Layout

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { RegisterForm } from '../../components/Register/Register'
import { ForgotPasswordForm } from '../../components/ForgotPassword/ForgotPassword'
import { LoginForm } from '../../components/Login/Login'
import { Dashboard } from '../../components/Dashboard/Dashboard'
import { PrivateRoute } from '../../helpers/privateRoute'
import { ResetPasswordForm } from '../../components/ResetPassword/ResetPassword'
import { VerifyEmail } from '../../components/VerifyEmail/VerifyEmail'

interface AppProps {}

interface AppState {
  login?: any
  users: any[]
}

class App extends Component<AppProps, AppState> {
  centered = css({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  })

  constructor(props: AppProps) {
    super(props)
    this.state = {
      login: undefined,
      users: [],
    }
  }

  public componentDidMount() {
    const usersService = client.service('users')
    client.authenticate().catch(() => this.setState({ login: null }))

    client.on('authenticated', login => {
      usersService.find().then(userPage => {
        const users = (userPage as Paginated<any>).data

        this.setState({ login, users })
      })

      return client.passport.verifyJWT(login.accessToken).then((payload: any) =>
        client
          .service('users')
          .get(payload.userId)
          .then(user => console.log(user)),
      )
    })

    client.on('logout', () =>
      this.setState({
        login: null,
        users: [],
      }),
    )
  }

  public login = () => {
    return (
      <Link to="/login">
        <Button type="primary">Login</Button>
      </Link>
    )
  }

  public render() {
    return (
      <Layout className={css({ height: '100vh' })}>
        <Router>
          <Content className={this.centered}>
            <Route exact path="/" component={this.login} />
            <PrivateRoute exact path="/dash" component={Dashboard} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/verify/:token" component={VerifyEmail} />
            <Route path="/forgot-password" component={ForgotPasswordForm} />
            <Route
              path="/reset-password/:token"
              component={ResetPasswordForm}
            />
          </Content>
        </Router>
      </Layout>
    )
  }
}

export default App
