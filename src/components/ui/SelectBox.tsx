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
  return (
    <SelectBoxInternal
      {...props}
      classes={{
        root: `custom-select ${props.class ?? ''}`,
        button: `custom-select-inner`,
        dropdown: `custom-select-options`
      }}
    />
  )
}

const SelectBoxInternal = (props: {
  value: string
  children: JSX.Element | ((close: () => void) => JSX.Element)
  icon?: JSX.Element
  classes: {
    root: string
    button: string
    dropdown: string
  }
}) => {
  const [expanded, setExpanded] = createSignal(false)

  let dropdownRef!: HTMLDivElement
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
      <div
        class={props.classes.button}
        onclick={(e) => {
          e.stopImmediatePropagation()
          setExpanded(!expanded())
        }}
      >
        <Show when={props.icon}>
          {props.icon}
        </Show>
        <span>{props.value}</span>
        <ChevronDownIcon class="neutral-400" />
      </div>
      <Show when={expanded()}>
        <div
          class={props.classes.dropdown}
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