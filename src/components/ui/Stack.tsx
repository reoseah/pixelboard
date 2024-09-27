import "./Stack.css"

import { JSX } from "solid-js/jsx-runtime"
import { splitProps, ValidComponent } from "solid-js"
import { Dynamic } from "solid-js/web"

const Stack = <T extends ValidComponent = "div",>(props: {
    as?: T,
    direction?: 'row' | 'column',
    spacing?: number,
    padding?: number,
    margin?: number,
    style?: JSX.CSSProperties,
} & JSX.HTMLAttributes<T>
) => {
    const [{
        as = "div",
        direction = "column",
        spacing,
        padding,
        class: className,
    }, rest] = splitProps(props, ['as', 'direction', 'spacing', 'padding', 'class', 'style'])

    // @ts-ignore
    return <Dynamic
        component={as}
        class={`stack ${direction}${className ? ` ${className}` : ""}`}
        style={{
            ...(spacing ? { '--spacing': `${spacing}rem` } : {}),
            ...(padding ? { '--padding': `${padding}rem` } : {}),
            ...(props.style || {}),
        }}
        {...(rest)}
    />
}

export default Stack