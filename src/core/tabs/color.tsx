import "./color.css"
import Tab from "./tab"
import PaletteIcon from "../../assets/icons/palette.svg"
import ChevronDownIcon from "../../assets/icons/chevron-down.svg"
import { Selectlike } from "../../components/ui/Select"
import { createSignal, onCleanup, useContext } from "solid-js"
import { CurrentColorContext } from "../../state/CurrentColor"

const Color: Tab = {
    place: "top",
    label: "Color",
    icon: PaletteIcon,
    contents: () => {
        return (
            <div class="color-tab">
                <Selectlike
                    button={
                        <>
                            <span>RGB</span>
                            <ChevronDownIcon />
                        </>
                    }
                    classes={{
                        root: "color-tab-mode",
                        button: "color-tab-mode-trigger",
                    }}
                >{(setRef, close) => {
                    return (
                        <div
                            ref={setRef}
                            class="color-tab-mode-menu"
                        >
                            <button class="color-tab-mode-option" onclick={close}>RGB</button>
                        </div>
                    )
                }}
                </Selectlike>
                <ColorSelector />
                <HueSlider />
                Color selection and palette (WIP)
            </div>
        )
    }
}

const ColorSelector = () => {
    const color = useContext(CurrentColorContext)

    const x = () => color.hsv()[1]
    const y = () => 100 - color.hsv()[2]
    const [dragging, setDragging] = createSignal(false)
    let ref!: HTMLDivElement

    const updateColor = (e: MouseEvent) => {
        const rect = ref.getBoundingClientRect()
        const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
        const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))

        // setX(x * 100)
        // setY(y * 100)

        color.setHsv([color.hsv()[0], x * 100, (1 - y) * 100])
    }

    const handleMouseDown = (e: MouseEvent) => {
        setDragging(true)
        updateColor(e)
        e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging()) {
            updateColor(e)
            e.preventDefault()
        }
    }
    const handleMouseUp = () => {
        if (dragging()) {
            setDragging(false)
        }
    }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    })

    return (
        <div
            class="color-selector"
            onmousedown={handleMouseDown}
            ref={el => ref = el}
            style={{
                background: `linear-gradient(transparent, black), linear-gradient(90deg, white, hwb(${color.hsv()[0]} 0% 0%))`,
                cursor: dragging() ? "none" : "crosshair",
            }}
        >
            <div
                class="color-selector-thumb"
                data-dragging={dragging()}
                style={{
                    left: `${x()}%`,
                    top: `${y()}%`,
                    background: color.hex(),
                }}
            ></div>
        </div>
    )
}

const HueSlider = () => {
    const color = useContext(CurrentColorContext)
    const [dragging, setDragging] = createSignal(false)
    let ref!: HTMLDivElement

    const updateColor = (e: MouseEvent) => {
        const rect = ref.getBoundingClientRect()
        const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))

        color.setHsv([x * 360, color.hsv()[1], color.hsv()[2]])
    }

    const handleMouseDown = (e: MouseEvent) => {
        setDragging(true)
        updateColor(e)
        e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging()) {
            updateColor(e)
            e.preventDefault()
        }
    }

    const handleMouseUp = () => {
        if (dragging()) {
            setDragging(false)
        }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    })

    return (
        <div
            class="hue-slider"
            style={{
                background: `linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)`,
                cursor: dragging() ? "none" : "crosshair",
            }}
            ref={el => ref = el}
            onmousedown={handleMouseDown}
        >
            <div
                class="hue-slider-thumb"
                data-dragging={dragging()}
                style={{
                    left: `${color.hsv()[0] / 360 * 100}%`,
                    top: "50%",
                    background: `hwb(${color.hsv()[0]} 0% 0%)`,
                }}></div>
        </div>
    )
}

export default Color