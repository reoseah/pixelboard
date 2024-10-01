import { splitProps, ValidComponent } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import './Stack.css'

const Stack = <T extends ValidComponent = 'div'>(props: {
  as?: T
  direction?: 'column' | 'row'
  margin?: number
  padding?: number
  spacing?: number
  style?: JSX.CSSProperties
} & JSX.HTMLAttributes<T>,
) => {
  const [{
    as = 'div',
    class: className,
    direction = 'column',
    padding,
    spacing,
  }, rest] = splitProps(props, ['as', 'direction', 'spacing', 'padding', 'class', 'style'])

  // @ts-expect-error TypeScript fails to infer this correctly
  return (
    <Dynamic
      class={`stack ${direction}${className ? ` ${className}` : ''}`}
      component={as}
      style={{
        ...(spacing ? { '--spacing': `${spacing}rem` } : {}),
        ...(padding ? { '--padding': `${padding}rem` } : {}),
        ...(props.style || {}),
      }}
      {...(rest)}
    />
  )
}

export default Stack
