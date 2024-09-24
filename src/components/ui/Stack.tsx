import "./Stack.css"

import { JSX } from "solid-js/jsx-runtime"
import { splitProps, ValidComponent } from "solid-js"
import { Dynamic } from "solid-js/web"

const Stack = <T extends ValidComponent,>(props: {
    as?: T,
    direction?: 'row' | 'column',
    spacing?: number,
    padding?: number,
    margin?: number,
} & JSX.HTMLAttributes<T>
) => {
    const [{ as = "div", direction = "column", spacing = 0, padding, margin, class: className }, rest] = splitProps(props, ['as', 'direction', 'spacing', 'padding', 'margin', 'class'])

    // @ts-ignore-next-line
    return <Dynamic component={as}
        class={`stack ${direction}${className ? ` ${className}` : ""}`}
        style={{
            '--spacing': `${spacing}rem`,
            ...(padding ? { '--padding': `${padding}rem` } : {}),
            ...(margin ? { '--margin': `${margin}rem` } : {}),
        }}
        {...rest}
    />
}

export default Stack