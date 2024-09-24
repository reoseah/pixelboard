import "./Input.css"
import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

const Input = (props: {
} & JSX.InputHTMLAttributes<HTMLInputElement>) => {
    const [{ class: className }, rest] = splitProps(props, ["class"])
    return (
        <input
            class={`input${className ? ` ${className}` : ""}`}
            {...rest}
        />
    )
}

export default Input