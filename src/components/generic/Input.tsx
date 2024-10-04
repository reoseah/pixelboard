import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

import './Input.css'

const Input = (props: {
  small?: boolean
} & JSX.InputHTMLAttributes<HTMLInputElement>) => {
  const [{ class: className, small }, rest] = splitProps(props, ['class', 'small'])

  return (
    <input
      class={`input${small ? ' small' : ''}${className ? ' ' + className : ''}`}
      {...rest}
    />
  )
}

export default Input
