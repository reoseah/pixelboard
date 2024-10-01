import { JSX, splitProps } from 'solid-js'

import './IconButton.css'

const IconButton = (props: {
  color?: 'danger' | 'neutral' | 'primary'
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const [{ color = 'primary' }, rest] = splitProps(props, ['color'])

  return (
    <button
      class={`icon-button ${color}`}
      {...rest}
    />
  )
}

export default IconButton
