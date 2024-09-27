import './Button.css'
import { splitProps } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

// TODO: add a small variant with a height of 1.75rem that can be used in toolbars
const Button = (props: {
    variant?: 'contained' | 'outline',
    color?: 'primary' | 'danger',
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>
) => {
    const [{ variant = "contained", color = "primary" }, rest] = splitProps(props, ['variant', 'color'])

    return (
        <button
            class={`button ${variant} ${color}`}
            {...rest}
        />
    )
}

export default Button