import { JSXElement } from 'solid-js'

import './ToggleButton.css'

export const ToggleButton = (props: {
  children: JSXElement
  class?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  pressed: boolean
  ref?: (el: HTMLButtonElement) => void
  title?: string
}) => {
  return (
    <button
      aria-pressed={props.pressed}
      class={`toggle-button ${props.class ?? ''}`}
      disabled={props.disabled}
      onclick={props.onClick}
      ref={props.ref}
      title={props.title}
      type="button"
    >
      {props.children}
    </button>
  )
}

export default ToggleButton
