import { makePersisted } from '@solid-primitives/storage'
import { createSignal, Match, onCleanup, Switch, useContext } from 'solid-js'

import SelectedColorContext from '../../state/SelectedColorContext'
import InputGroup from '../generic/InputGroup'
import NumberInput from '../generic/NumberInput'
import { Option, Select } from '../generic/Select'
import Stack from '../generic/Stack'
import './ColorPanel.css'

const ColorPanel = () => {
  const selectedColor = useContext(SelectedColorContext)!

  const [mode, setMode] = makePersisted(createSignal<'hsv' | 'rgb'>('hsv'), { name: 'color-tab.color-mode' })

  return (
    <Stack padding={0.75} spacing={0.75}>
      <Stack spacing={0.5}>
        <ColorSelector />
        <HueSlider />
      </Stack>
      <InputGroup>
        <Select class="flex-grow" value={mode().toUpperCase()}>
          {close => (
            <>
              <Option
                onClick={() => {
                  setMode('rgb')
                  close()
                }}
                selected={mode() === 'rgb'}
              >
                RGB
              </Option>
              <Option
                onClick={() => {
                  setMode('hsv')
                  close()
                }}
                selected={mode() === 'hsv'}
              >
                HSV
              </Option>
            </>
          )}
        </Select>
        <Switch>
          <Match when={mode() === 'rgb'}>
            <NumberInput
              class="w-3.5rem"
              icon={<span>R</span>}
              max={255}
              min={0}
              name="red"
              onChange={value => selectedColor.setRgb([value, selectedColor.rgb()[1], selectedColor.rgb()[2]])}
              value={selectedColor.rgb()[0]}
            />
            <NumberInput
              class="w-3.5rem"
              icon={<span>G</span>}
              max={255}
              min={0}
              name="green"
              onChange={value => selectedColor.setRgb([selectedColor.rgb()[0], value, selectedColor.rgb()[2]])}
              value={selectedColor.rgb()[1]}
            />
            <NumberInput
              class="w-3.5rem"
              icon={<span>B</span>}
              max={255}
              min={0}
              name="blue"
              onChange={value => selectedColor.setRgb([selectedColor.rgb()[0], selectedColor.rgb()[1], value])}
              value={selectedColor.rgb()[2]}
            />
          </Match>
          <Match when={mode() === 'hsv'}>
            <NumberInput
              class="w-3.5rem"
              icon={<span>H</span>}
              max={360}
              min={0}
              name="hue"
              onChange={value => selectedColor.setHsv([value, selectedColor.hsv()[1], selectedColor.hsv()[2]])}
              value={Math.round(selectedColor.hsv()[0])}
            />
            <NumberInput
              class="w-3.5rem"
              icon={<span>S</span>}
              max={100}
              min={0}
              name="saturation"
              onChange={value => selectedColor.setHsv([selectedColor.hsv()[0], value, selectedColor.hsv()[2]])}
              value={Math.round(selectedColor.hsv()[1])}
            />
            <NumberInput
              class="w-3.5rem"
              icon={<span>V</span>}
              max={100}
              min={0}
              name="value"
              onChange={value => selectedColor.setHsv([selectedColor.hsv()[0], selectedColor.hsv()[1], value])}
              value={Math.round(selectedColor.hsv()[2])}
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
  const selectedColor = useContext(SelectedColorContext)!

  const x = () => selectedColor.hsv()[1]
  const y = () => 100 - selectedColor.hsv()[2]
  const [dragging, setDragging] = createSignal(false)
  let ref!: HTMLDivElement

  const updateColor = (e: MouseEvent) => {
    const rect = ref.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))

    selectedColor.setHsv([selectedColor.hsv()[0], x * 100, (1 - y) * 100])
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
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return (
    <div
      class="color-selector"
      onMouseDown={handleMouseDown}
      ref={el => ref = el}
      style={{
        background: `linear-gradient(transparent, black), linear-gradient(90deg, white, hwb(${selectedColor.hsv()[0]} 0% 0%))`,
        cursor: dragging() ? 'none' : 'crosshair',
      }}
    >
      <div
        class="color-selector-thumb"
        data-dragging={dragging()}
        style={{
          background: selectedColor.hex(),
          left: `${x()}%`,
          top: `${y()}%`,
        }}
      />
    </div>
  )
}

const HueSlider = () => {
  const selectedColor = useContext(SelectedColorContext)!

  const [dragging, setDragging] = createSignal(false)
  let ref!: HTMLDivElement

  const updateColor = (e: MouseEvent) => {
    const rect = ref.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))

    selectedColor.setHsv([x * 360, selectedColor.hsv()[1], selectedColor.hsv()[2]])
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

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return (
    <div
      class="hue-slider"
      onMouseDown={handleMouseDown}
      ref={el => ref = el}
      style={{
        background: `linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)`,
        cursor: dragging() ? 'none' : 'crosshair',
      }}
    >
      <div
        class="hue-slider-thumb"
        data-dragging={dragging()}
        style={{
          background: `hwb(${selectedColor.hsv()[0]} 0% 0%)`,
          left: `${selectedColor.hsv()[0] / 360 * 100}%`,
          top: '50%',
        }}
      />
    </div>
  )
}
