import { createSignal } from 'solid-js'

import useClickOutside from '../../hooks/useClickOutside'
import { normalizeHex } from '../../util/color_conversion'
import './ColorInput.css'
import Input from './Input'
import InputDecoration from './InputDecoration'

const ColorInput = (props: {
  disabled?: boolean
  name?: string
  onChange: (value: string) => void
  title: string
  value: string
}) => {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>()
  useClickOutside(inputRef, () => {
    inputRef()?.blur()
  })

  const value = () => props.value.startsWith('#') ? props.value.slice(1) : props.value

  return (
    <InputDecoration class="w-5rem">
      <div
        class="color-input-swatch"
        style={{
          'background-color': `#${value()}`,
        }}
      >
        <input
          class="color-input-swatch-input"
          onInput={event => props.onChange((event.target as HTMLInputElement).value.slice(1))}
          type="color"
          value={normalizeHex(value()).substring(0, 7).padEnd(7, '0')}
        />
      </div>
      <Input
        class="color-input"
        disabled={props.disabled}
        maxlength="6"
        name={props.name}
        onblur={event => props.onChange(normalizeHex((event.target as HTMLInputElement).value))}
        onclick={event => (event.target as HTMLInputElement).select()}
        oninput={event => props.onChange((event.target as HTMLInputElement).value)}
        onkeydown={(event) => {
          if (event.key === 'Enter' || event.key === 'Escape') {
            (event.target as HTMLInputElement).blur()
          }
        }}
        ref={setInputRef}
        small
        title={props.title}
        type="text"
        value={value()}
      />
    </InputDecoration>
  )
}

export default ColorInput
