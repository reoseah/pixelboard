import { createSignal, JSX, onCleanup, Show } from 'solid-js'

import ChevronDownIcon from '../../assets/icons/chevron-down.svg'
import Menu from './Menu'
import './Select.css'

export const Select = (props: {
  children: (close: () => void) => JSX.Element
  class?: string
  icon?: JSX.Element
  title?: string
  value: string
}) => {
  return (
    <Selectlike
      button={(
        <>
          <Show when={props.icon}>
            {props.icon}
          </Show>
          <span>{props.value}</span>
          <ChevronDownIcon class="neutral-400" />
        </>
      )}
      children={(setRef, close) => (<Menu ref={setRef}>{props.children(close)}</Menu>)}
      classes={{
        button: `select-trigger`,
        root: `select ${props.class ?? ''}`,
      }}
      title={props.title}
    />
  )
}

export const Selectlike = (props: {
  button: JSX.Element
  children: (setRef: (el: HTMLElement) => void, close: () => void) => JSX.Element
  classes: {
    button: string
    root: string
  }
  title?: string
}) => {
  const [expanded, setExpanded] = createSignal(false)

  let dropdownRef!: HTMLElement
  const handleClickOutside = (event: MouseEvent) => {
    if (expanded() && !dropdownRef.contains(event.target as Node)) {
      setExpanded(false)
    }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (expanded() && event.key === 'Escape') {
      setExpanded(false)
    }
  }

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
  onCleanup(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div
      class={props.classes.root}
    >
      <button
        aria-expanded={expanded()}
        class={props.classes.button}
        onClick={(e) => {
          e.stopImmediatePropagation()
          setExpanded(!expanded())
        }}
        title={props.title}
      >
        {props.button}
      </button>
      <Show when={expanded()}>
        {props.children(el => dropdownRef = el, () => setExpanded(false))}
      </Show>
    </div>
  )
}

export const OptionDivider = Menu.Divider

// TODO: rename it to something like "SelectOption"
export const Option = Menu.Option
