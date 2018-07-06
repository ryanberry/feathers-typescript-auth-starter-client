import * as React from 'react'
import { shallow } from 'enzyme'
import { Header } from './Header'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockStore = configureStore([thunk])

it('renders without crashing', () => {
  const store = mockStore({
    auth: {
      isSignedIn: false,
    },
  })

  shallow(<Header store={store} />).dive()
})

it('allows users to log out', () => {
  const store = mockStore({
    auth: {
      isSignedIn: true,
    },
  })

  const wrapper = shallow(<Header store={store} />).dive()

  expect(wrapper.find('Button').exists()).toBeTruthy()
  wrapper.find('Button').simulate('click')

  expect(store.getActions()).toEqual([
    { type: 'SERVICES_AUTHENTICATION_LOGOUT' },
  ])
})
