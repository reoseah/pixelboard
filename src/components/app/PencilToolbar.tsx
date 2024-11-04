import { For, Show, useContext } from 'solid-js'

import CircleFilledIcon from '../../assets/icons/circle-filled.svg'
import CircleIcon from '../../assets/icons/circle.svg'
import DropIcon from '../../assets/icons/drop.svg'
import SquareFilledIcon from '../../assets/icons/square-filled.svg'
import SquareIcon from '../../assets/icons/square.svg'
import StrokeWidthIcon from '../../assets/icons/stroke-width.svg'
import SelectedColorContext from '../../state/SelectedColorContext'
import { PencilContext } from '../../state/tools/PencilContext'
import { modeGroups, modeNames } from '../../util/blending_modes'
import ColorInput from '../generic/ColorInput'
import InputGroup from '../generic/InputGroup'
import NumberInput from '../generic/NumberInput'
import { Option, OptionDivider, Select } from '../generic/Select'
import Stack from '../generic/Stack'
import ToggleButton from '../generic/ToggleButton'
import './PencilToolbar.css'

const PencilToolbar = () => {
  const {
    mode,
    setMode,
    setShape,
    setSize,
    shape,
    size,
  } = useContext(PencilContext)
  const selectedColor = useContext(SelectedColorContext)

  // TODO: use the new input component
  return (
    <Stack class="island" direction="row" padding={0.1875} spacing={0.25}>
      <InputGroup>
        <ToggleButton
          onClick={() => setShape('circle')}
          pressed={shape() === 'circle'}
          title="Round brush shape"
        >
          <Show fallback={<CircleIcon />} when={shape() === 'circle'}>
            <CircleFilledIcon />
          </Show>
        </ToggleButton>
        <ToggleButton
          onClick={() => setShape('square')}
          pressed={shape() === 'square'}
          title="Square brush shape"
        >
          <Show fallback={<SquareIcon />} when={shape() === 'square'}>
            <SquareFilledIcon />
          </Show>
        </ToggleButton>
      </InputGroup>

      <InputGroup>
        <NumberInput
          class="pencil-toolbar-stroke-width"
          icon={<StrokeWidthIcon />}
          max={100}
          min={1}
          name="pencil-stroke-width"
          onChange={value => setSize(value)}
          step={1}
          title="Stroke width"
          value={size()}
        />
        <ColorInput
          name="pencil-color"
          onChange={value => selectedColor.setHex(value)}
          title="Stroke color"
          value={selectedColor.hex()}
        />
      </InputGroup>

      <InputGroup>
        <Select
          class="pencil-toolbar-mode-select"
          icon={<DropIcon />}
          title="Blending mode"
          value={modeNames[mode()]}
        >
          {close => (
            <For each={modeGroups}>
              {(group, idx) => (
                <>
                  <For each={group}>
                    {m => (
                      <Option
                        disabled={m !== 'normal'}
                        onClick={() => {
                          setMode(m)
                          close()
                        }}
                        selected={mode() === m}
                        title={m !== 'normal' ? 'Not implemented yet' : undefined}
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
          disabled={true}
          max={100}
          min={0}
          name="pencil-opacity"
          onChange={value => selectedColor.setAlpha(value / 100)}
          size={3}
          step={1}
          title="Not implemented yet"
          unit="%"
          value={Math.floor(selectedColor.alpha() * 100)}
        />
      </InputGroup>
    </Stack>
  )
}

export default PencilToolbar
