import { createSignal } from "solid-js"
import "./ColorInput.css"
import useClickOutside from "../../hooks/useClickOutside"
import { normalizeHex } from "../../core/color_conversion"

const ColorInput = (props: {
    value: string
    onChange: (value: string) => void
    title: string
    disabled?: boolean
}) => {
    const [inputRef, setInputRef] = createSignal<HTMLInputElement>()
    useClickOutside(inputRef, () => {
        inputRef()?.blur()
    })

    const value = () => props.value.startsWith("#") ? props.value.slice(1) : props.value

    return (
        <div class="color-input-container" title={props.title}>
            <div
                class="color-input-swatch"
                style={{
                    "background-color": `#${value()}`
                }}
            ></div>
            <input
                type="text"
                class="color-input"
                value={value()}
                disabled={props.disabled}
                oninput={event => props.onChange((event.target as HTMLInputElement).value)}
                onclick={event => (event.target as HTMLInputElement).select()}
                onkeydown={event => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        (event.target as HTMLInputElement).blur()
                    }
                }}
                onblur={event => props.onChange(normalizeHex((event.target as HTMLInputElement).value))}
                ref={setInputRef}
            />
        </div>
    )
}

export default ColorInput