import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from './containers/App/App'
import registerServiceWorker from './registerServiceWorker'
import { PersistGate } from 'redux-persist/integration/react'
import 'ant-design-pro/dist/ant-design-pro.css'

import { store, persistor } from './store'
import { auth } from './store/actions/auth'
import { Loading } from './components/Loading/Loading'

store.dispatch(auth.authenticate({}))

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)
registerServiceWorker()
