import * as React from 'react'
import { shallow } from 'enzyme'
import { AppRouter } from './Router'
import { MemoryRouter } from 'react-router'

it('renders without crashing', () => {
  shallow(
    <MemoryRouter>
      <AppRouter />
    </MemoryRouter>,
  ).dive()
})
