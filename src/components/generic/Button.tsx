import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

import './Button.css'

// TODO: add a small variant with a height of 1.75rem that can be used in toolbars
const Button = (props: {
  color?: 'danger' | 'primary'
  variant?: 'contained' | 'outline'
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const [{ color = 'primary', variant = 'contained' }, rest] = splitProps(props, ['variant', 'color'])

  return (
    <button
      class={`button ${variant} ${color}`}
      {...rest}
    />
  )
}

export default Button
