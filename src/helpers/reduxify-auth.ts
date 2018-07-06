import { createAction, handleActions } from 'redux-actions'
import { Application } from '@feathersjs/feathers'

export default (app: Application, options = {}) => {
  const debug = console.debug

  const defaults = {
    assign: {
      resetExpires: undefined,
      resetToken: undefined,
      verifyExpires: undefined,
      verifyToken: undefined,
    },
    FULFILLED: 'FULFILLED',
    isError: 'isError',
    isLoading: 'isLoading',
    isSignedIn: 'isSignedIn',
    isUserAuthorized: (user: any) => true,
    PENDING: 'PENDING',
    REJECTED: 'REJECTED',
    token: 'accessToken',
    user: 'user',
  }

  const opts = Object.assign({}, defaults, options)

  const reducer = {
    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.PENDING}`]: (
      state: any,
      action: any,
    ) => {
      debug(
        `redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.PENDING}`,
        action,
      )

      return {
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: true,
        ignorePendingAuth: false,
      }
    },

    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.FULFILLED}`]: (
      state: any,
      action: any,
    ) => {
      debug(
        `redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.FULFILLED}`,
        action,
      )

      const user = action.payload[opts.user]

      if (state.ignorePendingAuth) {
        return {
          ...state,
          [opts.isError]: null,
          [opts.isLoading]: false,
          [opts.isSignedIn]: false,
          [opts.user]: null,
          [opts.token]: null,
          ignorePendingAuth: false,
        }
      }

      if (!opts.isUserAuthorized(user)) {
        return {
          ...state,
          [opts.isError]: new Error('User is not verified.'),
          [opts.isLoading]: false,
          [opts.isSignedIn]: false,
          [opts.user]: null,
          [opts.token]: null,
          ignorePendingAuth: false,
        }
      }

      return {
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: false,
        [opts.isSignedIn]: true,
        [opts.user]: Object.assign({}, user, opts.assign),
        [opts.token]: action.payload[opts.token],
        ignorePendingAuth: false,
      }
    },

    [`SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.REJECTED}`]: (
      state: any,
      action: any,
    ) => {
      debug(
        `redux:SERVICES_AUTHENTICATION_AUTHENTICATE_${opts.REJECTED}`,
        action,
      )
      return {
        ...state,
        [opts.isError]: action.payload,
        [opts.isLoading]: false,
        [opts.isSignedIn]: false,
        [opts.user]: null,
        [opts.token]: null,
        ignorePendingAuth: false,
      }
    },

    SERVICES_AUTHENTICATION_LOGOUT: (state: any, action: any) => {
      debug('redux:SERVICES_AUTHENTICATION_LOGOUT', action)
      app.logout()

      return {
        ...state,
        [opts.isError]: null,
        [opts.isLoading]: null,
        [opts.isSignedIn]: false,
        [opts.user]: null,
        [opts.token]: null,
        ignorePendingAuth: state.isLoading,
      }
    },

    SERVICES_AUTHENTICATION_USER: (state: any, action: any) => {
      debug('redux:SERVICES_AUTHENTICATION_USER', action)

      let user = state[opts.user]
      if (user) {
        user = { ...user, ...action.payload }
      }

      return {
        ...state,
        [opts.isError]: false,
        [opts.isLoading]: false,
        [opts.isSignedIn]: true,
        [opts.user]: user,
        ignorePendingAuth: false,
      }
    },
  }

  const AUTHENTICATE = 'SERVICES_AUTHENTICATION_AUTHENTICATE'
  const LOGOUT = 'SERVICES_AUTHENTICATION_LOGOUT'
  const USER = 'SERVICES_AUTHENTICATION_USER'

  return {
    authenticate: createAction(AUTHENTICATE, (p: any) => ({
      promise: app.authenticate(p),
    })),
    logout: createAction(LOGOUT),
    user: createAction(USER),

    reducer: handleActions(reducer, {
      [opts.isError]: null,
      [opts.isLoading]: false,
      [opts.isSignedIn]: false,
      [opts.user]: null,
      ignorePendingAuth: false,
    }),
  }
}
