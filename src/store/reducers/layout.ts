import { Action } from 'redux'

export interface LayoutState {
  menuCollapsed: boolean
}

const initialState: LayoutState = {
  menuCollapsed: false,
}

export function layout(
  state: LayoutState = initialState,
  action: Action<any>,
): LayoutState {
  switch (action.type) {
    case 'EXPAND_MENU':
      return { menuCollapsed: false }
    case 'COLLAPSE_MENU':
      return { menuCollapsed: true }
    case 'TOGGLE_MENU':
      return { menuCollapsed: !state.menuCollapsed }
  }

  return state
}
