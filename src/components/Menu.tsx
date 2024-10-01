import { JSXElement, Show } from 'solid-js'

import CheckIcon from '../assets/icons/check.svg'
import './Menu.css'

const Menu = (props: {
  children: JSXElement
  ref?: (el: HTMLElement) => void
}) => {
  return (
    <div class="menu" ref={props.ref}>
      {props.children}
    </div>
  )
}

const MenuDivider = () => {
  return (
    <div class="menu-divider" />
  )
}

const MenuOption = (props: {
  children: string
  disabled?: boolean
  onClick: () => void
  selected?: boolean
  title?: string
}) => {
  return (
    <button
      aria-selected={props.selected}
      class="menu-option"
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
    >
      <Show when={props.selected}>
        <CheckIcon />
      </Show>
      <span class="menu-option-label">
        {props.children}
      </span>
    </button>
  )
}

export default Object.assign(Menu, {
  Divider: MenuDivider,
  Option: MenuOption,
})
