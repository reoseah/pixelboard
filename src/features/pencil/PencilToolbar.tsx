import "./PencilToolbar.css"
import { useContext, Show, For } from "solid-js"
import CircleIcon from "../../assets/icons/circle.svg"
import SquareIcon from "../../assets/icons/square.svg"
import CircleFilledIcon from "../../assets/icons/circle-filled.svg"
import SquareFilledIcon from "../../assets/icons/square-filled.svg"
import StrokeWidthIcon from "../../assets/icons/stroke-width.svg"
import DropIcon from "../../assets/icons/drop.svg"
import { CurrentColorContext } from "../../api/CurrentColor"
import { PencilContext } from "./PencilContext"
import ColorInput from "../../components/ColorInput"
import InputGroup from "../../components/InputGroup"
import NumberInput from "../../components/NumberInput"
import { OptionDivider, Select, Option } from "../../components/Select"
import Stack from "../../components/Stack"
import ToggleButton from "../../components/ToggleButton"
import { modeNames, modeGroups } from "../../util/blending_modes"

const PencilToolbar = () => {
    const color = useContext(CurrentColorContext)
    const {
        shape,
        setShape,
        size,
        setSize,
        mode,
        setMode,
    } = useContext(PencilContext)

    // TODO: use the new input component
    return (
        <Stack class="island" spacing={.25} padding={.1875} direction="row">
            <InputGroup>
                <ToggleButton
                    title="Round brush shape"
                    pressed={shape() === 'circle'}
                    onClick={() => setShape('circle')}
                >
                    <Show when={shape() === 'circle'} fallback={<CircleIcon />}>
                        <CircleFilledIcon />
                    </Show>
                </ToggleButton>
                <ToggleButton
                    title="Square brush shape"
                    pressed={shape() === 'square'}
                    onClick={() => setShape('square')}
                >
                    <Show when={shape() === 'square'} fallback={<SquareIcon />}>
                        <SquareFilledIcon />
                    </Show>
                </ToggleButton>
            </InputGroup>

            <InputGroup>
                <NumberInput
                    class="pencil-toolbar-stroke-width"
                    name="pencil-stroke-width"
                    value={size()}
                    onChange={value => setSize(value)}
                    min={1}
                    max={100}
                    step={1}
                    icon={<StrokeWidthIcon />}
                    title="Stroke width"
                />
                <ColorInput
                    value={color.hex()}
                    name="pencil-color"
                    onChange={value => color.setHex(value)}
                    title="Stroke color"
                />
            </InputGroup>

            <InputGroup>
                <Select
                    class="pencil-toolbar-mode-select"
                    title="Blending mode"
                    value={modeNames[mode()]}
                    icon={<DropIcon />}
                >
                    {(close) => (
                        <For each={modeGroups}>{(group, idx) => (
                            <>
                                <For each={group}>
                                    {m => (
                                        <Option
                                            selected={mode() === m}
                                            onClick={() => {
                                                setMode(m)
                                                close()
                                            }}
                                            disabled={m !== "normal"}
                                            title={m !== "normal" ? "Not implemented yet" : undefined}
                                        >
                                            {modeNames[m]}
                                        </Option>
                                    )}
                                </For>
                                <Show when={idx() != modeGroups.length - 1}>
                                    <OptionDivider />
                                </Show>
                            </>
                        )}
                        </For>
                    )}
                </Select>
                <NumberInput
                    class="pencil-toolbar-opacity"
                    name="pencil-opacity"
                    value={Math.floor(color.alpha() * 100)}
                    onChange={value => color.setAlpha(value / 100)}
                    title="Not implemented yet"
                    disabled={true}
                    min={0}
                    max={100}
                    step={1}
                    size={3}
                    unit={'%'} />
            </InputGroup>
        </Stack>
    )
}

export default PencilToolbar