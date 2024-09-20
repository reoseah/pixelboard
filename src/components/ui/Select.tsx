import "./Select.css"
import { createSignal, onCleanup, Show, JSX } from "solid-js"
import CheckIcon from "../../assets/icons/check.svg"
import ChevronDownIcon from "../../assets/icons/chevron-down.svg"
import Menu from "./Menu"

export const Select = (props: {
  icon?: JSX.Element
  value: string
  children: (close: () => void) => JSX.Element
  class?: string
}) => {
  return (
    <SelectInternal
      button={
        <>
          <Show when={props.icon}>
            {props.icon}
          </Show>
          <span>{props.value}</span>
          <ChevronDownIcon class="neutral-400" />
        </>
      }
      children={(setRef, close) => (<Menu ref={setRef}>{props.children(close)}</Menu>)}
      classes={{
        root: `custom-select ${props.class ?? ''}`,
        button: `custom-select-trigger`
      }}
    />
  )
}

const SelectInternal = (props: {
  button: JSX.Element
  children: (setRef: (el: HTMLElement) => void, close: () => void) => JSX.Element
  classes: {
    root: string
    button: string
  }
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
      aria-expanded={expanded()}
    >
      <button
        class={props.classes.button}
        onclick={(e) => {
          e.stopImmediatePropagation()
          setExpanded(!expanded())
        }}
      >
        {props.button}
      </button>
      <Show when={expanded()}>
        {props.children((el) => dropdownRef = el, () => setExpanded(false))}
      </Show>
    </div>
  )
}

export const Option = (props: {
  value: string
  selected?: boolean
  onClick: () => void
  children: string
  disabled?: boolean
  title?: string
}) => {
  return (
    <button
      class={`custom-option`}
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      aria-selected={props.selected}
    >
      <Show when={props.selected}>
        <div class="custom-option-check">
          <CheckIcon />
        </div>
      </Show>
      <div class="custom-option-label">
        {props.children}
      </div>
    </button>
  )
}

export const OptionDivider = Menu.Divider