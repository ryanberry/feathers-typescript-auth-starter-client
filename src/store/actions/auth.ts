import reduxifyAuthentication from '../../helpers/reduxify-auth'
import { client } from '../../client'
export const auth = reduxifyAuthentication(client, {
  token: 'accessToken',
})
