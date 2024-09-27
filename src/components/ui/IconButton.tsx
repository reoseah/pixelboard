import './IconButton.css'
import { JSX, splitProps } from "solid-js"

const IconButton = (props: {
    color?: 'primary' | 'neutral' | 'danger',
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>
) => {
    const [{ color = "primary" }, rest] = splitProps(props, ['color'])

    return (
        <button
            class={`icon-button ${color}`}
            {...rest}
        />
    )
}

export default IconButton