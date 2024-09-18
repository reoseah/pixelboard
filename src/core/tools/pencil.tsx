import "./pencil.css"
import { createSignal, For, Show, useContext } from 'solid-js'
import PencilIcon from '../../assets/icons/pencil.svg'
import CircleIcon from "../../assets/icons/circle.svg"
import SquareIcon from "../../assets/icons/square.svg"
import CircleFilledIcon from "../../assets/icons/circle-filled.svg"
import SquareFilledIcon from "../../assets/icons/square-filled.svg"
import StrokeWidthIcon from "../../assets/icons/stroke-width.svg"
import DropIcon from "../../assets/icons/drop.svg"
import { isViewportClick, Tool } from './tool'
import { ViewportPositionContext } from '../../state/ViewportPosition'
import { PencilStroke } from '../canvas_actions/pencil_stroke'
import { VirtualCanvasContext } from '../../state/VirtualCanvas'
import { BlendingMode, modeGroups, modeNames } from './blending_modes'
import { Select, CustomOption, OptionDivider } from '../../components/ui/CustomSelect'
import InputGroup from '../../components/ui/InputGroup'
import NumberInput from '../../components/ui/NumberInput'
import ToggleButton from '../../components/ui/ToggleButton'

const createPencil = (): Tool => {
    const [, viewportActions] = useContext(ViewportPositionContext)
    const [, virtualCanvasActions] = useContext(VirtualCanvasContext)

    const [currentMousePos, setCurrentMousePos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    let currentAction: PencilStroke | null = null

    const [shape, setShape] = createSignal<'circle' | 'square'>('circle')
    const [size, setSize] = createSignal(1)
    const [mode, setMode] = createSignal<BlendingMode>('normal')
    const [opacity, setOpacity] = createSignal(100)

    const handleMouseDown = (e: MouseEvent) => {
        if (!isViewportClick(e)) {
            return
        }

        e.preventDefault()

        const pos = {
            x: Math.floor(viewportActions.toCanvasX(e.clientX)),
            y: Math.floor(viewportActions.toCanvasY(e.clientY))
        }
        setCurrentMousePos(pos)
        const action: PencilStroke = {
            type: "pencil_stroke",
            points: [pos],
            shape: shape(),
            size: size(),
        }
        virtualCanvasActions.add(action)
        currentAction = action

        // TODO: draw straight lines when shift is pressed
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (currentAction) {
            let newX = Math.floor(viewportActions.toCanvasX(e.clientX))
            let newY = Math.floor(viewportActions.toCanvasY(e.clientY))

            if (newX === currentMousePos().x && newY === currentMousePos().y) {
                return
            }

            const newAction: PencilStroke = {
                ...currentAction,
                points: [...currentAction.points, { x: newX, y: newY }]
            }
            virtualCanvasActions.replace(currentAction, newAction)
            currentAction = newAction

            setCurrentMousePos({ x: newX, y: newY })
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (!isViewportClick(e)) {
            return
        }
        currentAction = null
    }

    const PencilToolbar = () => {
        return (
            <>
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

                <NumberInput
                    class="pencil-toolbar-stroke-width"
                    value={size()}
                    onChange={value => setSize(value)}
                    min={1}
                    max={100}
                    step={1}
                    icon={<StrokeWidthIcon />}
                    title="Stroke width"
                />

                <InputGroup>
                    <Select
                        class="pencil-toolbar-mode-select"
                        value={modeNames[mode()]}
                        icon={<DropIcon />}
                    >
                        {(close) => (
                            <For each={modeGroups}>{(group, idx) => (
                                <>
                                    <For each={group}>
                                        {m => (
                                            <CustomOption
                                                value={modeNames[m]}
                                                selected={mode() === m}
                                                onClick={() => {
                                                    setMode(m)
                                                    close()
                                                }}
                                                disabled={m !== "normal"}
                                                title={m !== "normal" ? "Not implemented yet" : undefined}
                                            >
                                                {modeNames[m]}
                                            </CustomOption>
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
                        value={opacity()}
                        onChange={value => setOpacity(value)}
                        title="Not implemented yet"
                        disabled={true}
                        min={0}
                        max={100}
                        step={1}
                        size={3}
                        unit={'%'} />
                </InputGroup>
            </>
        )
    }

    return {
        label: "Pencil",
        key: "B",
        icon: PencilIcon,
        subToolbar: PencilToolbar,
        onSelect: () => {
            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        },
        onDeselect: () => {
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }
}

export default createPencil