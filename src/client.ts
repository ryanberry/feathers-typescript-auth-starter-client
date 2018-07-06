import * as io from 'socket.io-client'
import feathers, { Application } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'

function clientFactory(): Application<any> {
  const feathersApp = feathers() as Application<any>

  const socket = io('http://localhost:3030')

  feathersApp.configure(socketio(socket))

  feathersApp.configure(
    authentication({
      storage:
        process.env.NODE_ENV === 'test' ? undefined : window.localStorage,
    }),
  )

  return feathersApp
}

export const client = clientFactory()

export default client
