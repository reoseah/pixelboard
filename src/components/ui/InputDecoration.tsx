import "./InputDecoration.css"
import { JSXElement, splitProps } from "solid-js"

const InputDecoration = (props: {
    children: JSXElement,
    class?: string,
}) => {
    const [
        { children, class: className },
        rest
    ] = splitProps(props, ["children", "class"])

    return (
        <div
            class={`input-decoration${className ? ` ${className}` : ""}`}
            {...rest}
        >
            {children}
        </div>
    )
}

export default InputDecoration