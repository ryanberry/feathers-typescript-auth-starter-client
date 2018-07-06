import reduxifyServices from 'feathers-redux'
import client from '../../client'
export const services = reduxifyServices(client, [
  'users',
  'authManagement',
  'authentication',
])
