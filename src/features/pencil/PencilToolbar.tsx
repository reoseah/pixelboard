import { For, Show, useContext } from 'solid-js'

import CircleIcon from '../../assets/icons/circle.svg'
import CircleFilledIcon from '../../assets/icons/circle-filled.svg'
import DropIcon from '../../assets/icons/drop.svg'
import SquareIcon from '../../assets/icons/square.svg'
import SquareFilledIcon from '../../assets/icons/square-filled.svg'
import StrokeWidthIcon from '../../assets/icons/stroke-width.svg'
import ColorInput from '../../components/ColorInput'
import InputGroup from '../../components/InputGroup'
import NumberInput from '../../components/NumberInput'
import { Option, OptionDivider, Select } from '../../components/Select'
import Stack from '../../components/Stack'
import ToggleButton from '../../components/ToggleButton'
import CurrentColor from '../../state/CurrentColor'
import { modeGroups, modeNames } from '../../util/blending_modes'
import { PencilContext } from './PencilContext'
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
          onChange={value => CurrentColor.setHex(value)}
          title="Stroke color"
          value={CurrentColor.hex()}
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
          onChange={value => CurrentColor.setAlpha(value / 100)}
          size={3}
          step={1}
          title="Not implemented yet"
          unit="%"
          value={Math.floor(CurrentColor.alpha() * 100)}
        />
      </InputGroup>
    </Stack>
  )
}

export default PencilToolbar
