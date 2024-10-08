import { For, Show, useContext } from 'solid-js'

import SaveIcon from '../../assets/icons/save.svg'
import CanvasSelectionContext, { useSelectionBounds } from '../../state/CanvasSelectionContext'
import RegistryContext from '../../state/RegistryContext'
import SavePropertiesContext, { formats } from '../../state/SavePropertiesContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import VirtualCanvasContext, { renderArea } from '../../state/VirtualCanvasContext'
import IconButton from '../generic/IconButton'
import Input from '../generic/Input'
import InputGroup from '../generic/InputGroup'
import { Option, Select } from '../generic/Select'
import Stack from '../generic/Stack'
import './SelectionRenderer.css'

const SelectionRenderer = () => {
  const viewport = useContext(ViewportPositionContext)
  const canvas = useContext(VirtualCanvasContext)
  const selection = useContext(CanvasSelectionContext)
  const registry = useContext(RegistryContext)

  const bounds = useSelectionBounds()

  const { scale, setScale, format, setFormat } = useContext(SavePropertiesContext)

  return (
    <Show when={selection.parts.length !== 0}>
      <svg
        class="selection-renderer"
        height={bounds().height * viewport.scale() + 1}
        style={{
          left: `${bounds().x * viewport.scale()}px`,
          top: `${bounds().y * viewport.scale()}px`,
        }}
        width={bounds().width * viewport.scale() + 1}
      >
        <For each={selection.parts}>
          {part => (
            <Show when={part.type === 'rectangle'}>
              <rect
                fill="none"
                height={part.height * viewport.scale()}
                stroke="black"
                stroke-dasharray="3 3"
                stroke-dashoffset="0"
                width={part.width * viewport.scale()}
                x={part.x - bounds().x + 0.5}
                y={part.y - bounds().y + 0.5}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  dur=".5s"
                  from="0"
                  repeatCount="indefinite"
                  to="6"
                />
              </rect>
              <rect
                fill="none"
                height={part.height * viewport.scale()}
                stroke="white"
                stroke-dasharray="3 3"
                stroke-dashoffset="3"
                width={part.width * viewport.scale()}
                x={part.x - bounds().x + 0.5}
                y={part.y - bounds().y + 0.5}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  dur=".5s"
                  from="3"
                  repeatCount="indefinite"
                  to="9"
                />
              </rect>
            </Show>
          )}
        </For>
      </svg>
      <Stack
        class="island"
        direction="row"
        padding={0.1875}
        spacing={0.25}
        style={{
          left: `${bounds().x * viewport.scale() + bounds().width * viewport.scale() / 2}px`,
          position: 'absolute',
          top: `${bounds().y * viewport.scale() + bounds().height * viewport.scale() + 8}px`,
          transform: 'translate(-50%, 0)',
        }}
      >
        <InputGroup>
          <Select
            class="w-3.5rem"
            title="Export format"
            value={formats.find(option => option.value === format())?.label || 'Unknown'}
          >
            {close => (
              <For each={formats}>
                {option => (
                  <Option
                    onClick={() => {
                      setFormat(option.value)
                      close()
                    }}
                    selected={option.value === format()}
                  >
                    {option.label}
                  </Option>
                )}
              </For>
            )}
          </Select>

          <Input
            class="w-2.5rem"
            onblur={(e) => {
              const value = parseFloat(e.currentTarget.value)
              if (!isNaN(value)) {
                setScale(value)
              }
            }}
            onfocus={(e) => {
              e.currentTarget.value = scale().toString()
              e.currentTarget.select()
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                e.currentTarget.blur()
              }
            }}
            small
            title="Export scale"
            value={scale() + 'x'}
          />

          <IconButton
            onclick={() => {
              renderArea(
                canvas,
                registry.actionTypes,
                bounds().x,
                bounds().y,
                bounds().width,
                bounds().height,
                scale(),
                {
                  quality: 1,
                  type: format(),
                },
              ).then((blob) => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'selection.' + format().split('/')[1]
                a.click()
                URL.revokeObjectURL(url)
              })
            }}
            title="Export selection"
          >
            <SaveIcon />
          </IconButton>
        </InputGroup>
      </Stack>
    </Show>
  )
}

export default SelectionRenderer
