import { JSX, onCleanup, Show } from 'solid-js'

import './NumberInput.css'

export const NumberInput = (props: {
  class?: string
  disabled?: boolean
  icon?: JSX.Element
  max?: number
  min?: number
  name?: string
  onChange: (value: number) => void
  size?: number
  step?: number
  title?: string
  unit?: JSX.Element
  value: number
}) => {
  let ref!: HTMLElement

  const handleClickOutside = (event: MouseEvent) => {
    if (!event.composedPath().includes(ref)) {
      ref.querySelector('input')?.blur()
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  return (
    <label
      class={`number-input-container ${props.class ?? ''}`}
      ref={el => ref = el}
      title={props.title}
    >
      <Show when={props.icon}>
        <div class="input-icon">
          {props.icon}
        </div>
      </Show>
      <input
        class="number-input"
        disabled={props.disabled}
        max={props.max}
        min={props.min}
        name={props.name}
        onclick={event => (event.target as HTMLInputElement).select()}
        onfocus={(event) => {
          const handleClickOutside = (event: MouseEvent) => {
            if (!event.composedPath().includes(event.target!)) {
              (event.target as HTMLInputElement).blur()
            }
          }
          document.addEventListener('click', handleClickOutside)
          event.target?.addEventListener('blur', () => {
            document.removeEventListener('click', handleClickOutside)
          }, { once: true })
        }}
        oninput={event => props.onChange(Number((event.target as HTMLInputElement).value))}
        onkeydown={(event) => {
          if (event.key === 'Enter' || event.key === 'Escape') {
            (event.target as HTMLInputElement).blur()
          }
        }}
        size={props.size}
        step={props.step}
        type="number"
        value={props.value}
      />
      <Show when={props.unit}>
        <div class="number-input-unit">
          {props.unit}
        </div>
      </Show>
    </label>
  )
}

export default NumberInput
