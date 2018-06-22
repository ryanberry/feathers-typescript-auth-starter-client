import * as io from 'socket.io-client'
import feathers, { Application } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'

type ExtendedApplication = {
  init: boolean
  isAuthenticated: boolean
}

function clientFactory(): Application<any> & ExtendedApplication {
  const feathersApp = feathers() as Application<any> & ExtendedApplication

  feathersApp.init = false

  const socket = io('http://localhost:3030')

  feathersApp.configure(socketio(socket))

  feathersApp.configure(
    authentication({
      storage: window.localStorage,
    }),
  )

  feathersApp.authenticate().catch(() => (feathersApp.init = true))

  feathersApp.on('authenticated', () => {
    feathersApp.isAuthenticated = true
    feathersApp.init = true
  })

  feathersApp.on('logout', user => {
    feathersApp.isAuthenticated = false
  })

  return feathersApp
}

const client = clientFactory()

export default client
