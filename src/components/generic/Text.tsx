import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

import './Text.css'

const Text = (props: {
  muted?: boolean
  size?: 'large' | 'medium' | 'small'
} & JSX.HTMLAttributes<HTMLDivElement>,
) => {
  const [{ class: className, muted = false, size = 'medium' }, rest] = splitProps(props, ['size', 'muted', 'class'])

  return (
    <div
      class={`text text-${size}${muted ? ' text-muted' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    />
  )
}

export default Text
