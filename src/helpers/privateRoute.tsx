import { Component } from 'react'
import { replace } from 'connected-react-router'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

class Loading extends Component {
  render() {
    return 'Loading'
  }
}

export const UserIsAuthenticated = connectedRouterRedirect({
  // extract user data from state
  authenticatedSelector: (state: any) => state.auth.isSignedIn,

  /* When signin is pending but not fulfilled: */
  // determine if signin is pending
  authenticatingSelector: (state /* , ownProps */) => state.auth.isLoading,
  // component to render while signin is pending
  AuthenticatingComponent: Loading,

  redirectPath: '/login',

  // action to dispatch to redirect
  redirectAction: replace,

  /* For documentation: */
  wrapperDisplayName: 'UserIsAuthenticated',
})

export const UserIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) =>
    locationHelperBuilder({}).getRedirectQueryParam(ownProps) || '/',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: (state: any) => state.auth.isSignedIn === false,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated',
})
