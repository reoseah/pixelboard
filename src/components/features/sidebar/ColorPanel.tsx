import "./ColorPanel.css"
import { makePersisted } from "@solid-primitives/storage";
import { createSignal, useContext, Switch, Match, onCleanup } from "solid-js";
import { CurrentColorContext } from "../../../state/CurrentColor";
import InputGroup from "../../ui/InputGroup";
import NumberInput from "../../ui/NumberInput";
import { Select, Option } from "../../ui/Select";
import Stack from "../../ui/Stack";

const ColorPanel = () => {
    const [mode, setMode] = makePersisted(createSignal<"rgb" | "hsv">("hsv"), { name: "color-tab.color-mode" })
    const color = useContext(CurrentColorContext)

    return (
        <Stack spacing={.75} padding={.75}>
            <Stack spacing={.5}>
                <ColorSelector />
                <HueSlider />
            </Stack>
            <InputGroup>
                <Select value={mode().toUpperCase()} class="flex-grow">
                    {(close) => (
                        <>
                            <Option onClick={() => { setMode("rgb"); close() }} selected={mode() === "rgb"}>RGB</Option>
                            <Option onClick={() => { setMode("hsv"); close() }} selected={mode() === "hsv"}>HSV</Option>
                        </>
                    )}
                </Select>
                <Switch>
                    <Match when={mode() === "rgb"}>
                        <NumberInput
                            class="w-3.5rem"
                            name="red"
                            value={color.rgb()[0]}
                            onChange={value => color.setRgb([value, color.rgb()[1], color.rgb()[2]])}
                            min={0}
                            max={255}
                            icon={<span>R</span>}
                        />
                        <NumberInput
                            class="w-3.5rem"
                            name="green"
                            value={color.rgb()[1]}
                            onChange={value => color.setRgb([color.rgb()[0], value, color.rgb()[2]])}
                            min={0}
                            max={255}
                            icon={<span>G</span>}
                        />
                        <NumberInput
                            class="w-3.5rem"
                            name="blue"
                            value={color.rgb()[2]}
                            onChange={value => color.setRgb([color.rgb()[0], color.rgb()[1], value])}
                            min={0}
                            max={255}
                            icon={<span>B</span>}
                        />
                    </Match>
                    <Match when={mode() === "hsv"}>
                        <NumberInput
                            class="w-3.5rem"
                            name="hue"
                            value={Math.round(color.hsv()[0])}
                            onChange={value => color.setHsv([value, color.hsv()[1], color.hsv()[2]])}
                            min={0}
                            max={360}
                            icon={<span>H</span>}
                        />
                        <NumberInput
                            class="w-3.5rem"
                            name="saturation"
                            value={Math.round(color.hsv()[1])}
                            onChange={value => color.setHsv([color.hsv()[0], value, color.hsv()[2]])}
                            min={0}
                            max={100}
                            icon={<span>S</span>}
                        />
                        <NumberInput
                            class="w-3.5rem"
                            name="value"
                            value={Math.round(color.hsv()[2])}
                            onChange={value => color.setHsv([color.hsv()[0], color.hsv()[1], value])}
                            min={0}
                            max={100}
                            icon={<span>V</span>}
                        />
                    </Match>
                </Switch>
            </InputGroup>
            Color selection and palette (WIP)
        </Stack>
    )
}

export default ColorPanel

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
