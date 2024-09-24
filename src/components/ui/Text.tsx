import "./Text.css"

import { JSX } from "solid-js/jsx-runtime"
import { splitProps } from "solid-js"

const Text = (props: {
    size?: 'small' | 'medium' | 'large',
    muted?: boolean,
} & JSX.HTMLAttributes<HTMLDivElement>
) => {
    const [{ size = "medium", muted = false, class: className }, rest] = splitProps(props, ['size', 'muted', 'class'])

    return (
        <div
            class={`text text-${size}${muted ? ' text-muted' : ''}${className ? ` ${className}` : ""}`}
            {...rest}
        />
    )
}

export default Text