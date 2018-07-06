import { createStore, combineReducers, applyMiddleware, Store } from 'redux'
import reduxPromiseMiddleware from 'redux-promise-middleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Dispatch } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import reduxMulti from 'redux-multi'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { auth } from './store/actions/auth'
import { services } from './store/actions/services'
import { layout } from './store/reducers/layout'

const persistConfig = {
  key: 'root',
  storage,
}

const reducers = combineReducers({
  users: services.users.reducer,
  auth: auth.reducer,
  layout,
})

export const store = createStore(
  persistReducer(persistConfig, reducers),
  {},
  composeWithDevTools(
    applyMiddleware(ReduxThunk, reduxPromiseMiddleware(), reduxMulti),
  ),
)

export const persistor = persistStore(store)

export interface ConnectedReduxProps {
  dispatch: Dispatch
  store?: Store
}
