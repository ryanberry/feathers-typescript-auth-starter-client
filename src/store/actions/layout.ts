import { Action } from 'redux'

export const expandMenu = (): Action => ({
  type: 'EXPAND_MENU',
})

export const collapseMenu = (): Action => ({
  type: 'COLLAPSE_MENU',
})

export const toggleMenu = (): Action => ({
  type: 'TOGGLE_MENU',
})
