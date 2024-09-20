import "./Select.css"
import { createSignal, onCleanup, Show, JSX } from "solid-js"
import ChevronDownIcon from "../../assets/icons/chevron-down.svg"
import Menu from "./Menu"

export const Select = (props: {
  icon?: JSX.Element
  value: string
  children: (close: () => void) => JSX.Element
  class?: string
}) => {
  return (
    <Selectlike
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
        root: `select ${props.class ?? ''}`,
        button: `select-trigger`
      }}
    />
  )
}

export const Selectlike = (props: {
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
    >
      <button
        class={props.classes.button}
        aria-expanded={expanded()}
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

export const OptionDivider = Menu.Divider
export const Option = Menu.Option