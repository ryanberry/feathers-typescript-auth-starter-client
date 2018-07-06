import * as React from 'react'
import { shallow } from 'enzyme'
import { Loading } from './Loading'

it('renders without crashing', () => {
  const loading = shallow(<Loading />)

  expect(loading.find('Spin').exists()).toBe(true)
})
