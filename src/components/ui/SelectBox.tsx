import "./SelectBox.css"
import { createSignal, onCleanup, Show, JSX } from "solid-js"
import CheckIcon from "../../assets/icons/check.svg"
import ChevronDownIcon from "../../assets/icons/chevron-down.svg"

export const SelectBox = (props: {
  value: string
  children: JSX.Element | ((close: () => void) => JSX.Element)
  class?: string
  icon?: JSX.Element
}) => {
  const [expanded, setExpanded] = createSignal(false)

  let dropdownRef!: HTMLDivElement
  const handleClickOutside = (event: MouseEvent) => {
    if (expanded() && !dropdownRef.contains(event.target as Node)) {
      console.log('closing')
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
      class={`custom-select ${props.class ?? ''}`}
      aria-expanded={expanded()}
    >
      <div
        class="custom-select-inner"
        onclick={(e) => {
          e.stopImmediatePropagation()
          setExpanded(!expanded())

          console.log('expanding')
        }}
      >
        <Show when={props.icon}>
          <div class="input-icon">
            {props.icon}
          </div>
        </Show>
        <span class="custom-select-value">{props.value}</span>
        <div class="custom-select-chevron">
          <ChevronDownIcon />
        </div>
      </div>
      <Show when={expanded()}>
        <div
          class="custom-select-options"
          ref={el => dropdownRef = el}
        >
          <Show
            when={typeof props.children === 'function'}
            fallback={<>{props.children}</>}
          >
            {(props.children as (close: () => void) => JSX.Element)(() => setExpanded(false))}
          </Show>
        </div>
      </Show>
    </div>
  )
}

export const CustomOption = (props: {
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

export const OptionDivider = () => {
  return (
    <div class="option-divider"></div>
  )
}