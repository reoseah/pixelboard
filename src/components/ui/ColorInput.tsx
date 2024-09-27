import { createSignal } from "solid-js"
import "./ColorInput.css"
import useClickOutside from "../../hooks/useClickOutside"
import { normalizeHex } from "../../core/color_conversion"
import InputDecoration from "./InputDecoration"
import Input from "./Input"

const ColorInput = (props: {
    value: string
    onChange: (value: string) => void
    title: string
    disabled?: boolean
    name?: string
}) => {
    const [inputRef, setInputRef] = createSignal<HTMLInputElement>()
    useClickOutside(inputRef, () => {
        inputRef()?.blur()
    })

    const value = () => props.value.startsWith("#") ? props.value.slice(1) : props.value

    return (
        <InputDecoration class="w-5rem">
            <div
                class="color-input-swatch"
                style={{
                    "background-color": `#${value()}`
                }}
            >
                <input
                    type="color"
                    class="color-input-swatch-input"
                    value={normalizeHex(value()).substring(0, 7).padEnd(7, "0")}
                    oninput={event => props.onChange((event.target as HTMLInputElement).value.slice(1))}
                />
            </div>
            <Input
                small
                type="text"
                class="color-input"
                title={props.title}
                value={value()}
                name={props.name}
                disabled={props.disabled}
                oninput={event => props.onChange((event.target as HTMLInputElement).value)}
                onclick={event => (event.target as HTMLInputElement).select()}
                maxlength="6"
                onkeydown={event => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        (event.target as HTMLInputElement).blur()
                    }
                }}
                onblur={event => props.onChange(normalizeHex((event.target as HTMLInputElement).value))}
                ref={setInputRef}
            />
        </InputDecoration>
    )
}

export default ColorInput