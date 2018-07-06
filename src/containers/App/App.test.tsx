import * as React from 'react'
import { shallow } from 'enzyme'
import { App } from './App'

jest.mock('ant-design-pro/lib/GlobalFooter', () => () => `Footer`)

it('renders without crashing', () => {
  shallow(<App />).dive()
})
