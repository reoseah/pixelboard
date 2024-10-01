import "./Input.css"
import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

const Input = (props: {
    small?: boolean
} & JSX.InputHTMLAttributes<HTMLInputElement>) => {
    const [{ class: className, small }, rest] = splitProps(props, ["class", "small"])

    return (
        <input
            class={`input${small ? " small" : ""}${className ? " " + className : ""}`}
            {...rest}
        />
    )
}

export default Input