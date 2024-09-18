import { createSignal, onCleanup } from "solid-js"
import "./ColorInput.css"
import useClickOutside from "../../hooks/useClickOutside"

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

    return (
        <div class="color-input-container" title={props.title}>
            <div
                class="color-input-swatch"
                style={{
                    "background-color": `#${props.value}`
                }}
            ></div>
            <input
                type="text"
                class="color-input"
                value={props.value}
                disabled={props.disabled}
                oninput={event => props.onChange((event.target as HTMLInputElement).value)}
                onclick={event => (event.target as HTMLInputElement).select()}
                onkeydown={event => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        (event.target as HTMLInputElement).blur()
                    }
                }}
                ref={setInputRef}
            />
        </div>
    )
}

export default ColorInput