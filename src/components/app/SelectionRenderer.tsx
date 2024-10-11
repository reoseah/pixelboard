import { createMemo, For, Show, useContext } from 'solid-js'

import CanvasSelectionContext, { getSelectionBounds } from '../../state/CanvasSelectionContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import Stack from '../generic/Stack'
import SaveAreaControls from './SaveAreaControls'
import './SelectionRenderer.css'

const SelectionRenderer = () => {
  const viewport = useContext(ViewportPositionContext)
  const selection = useContext(CanvasSelectionContext)

  const bounds = createMemo(() => getSelectionBounds(selection))

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
          position: 'absolute',
          left: `${bounds().x * viewport.scale() + bounds().width * viewport.scale() / 2}px`,
          top: `${bounds().y * viewport.scale() + bounds().height * viewport.scale() + 8}px`,
          transform: 'translate(-50%, 0)',
        }}
      >
        <SaveAreaControls
          x={bounds().x}
          y={bounds().y}
          width={bounds().width}
          height={bounds().height}
          name="Selection"
        />
      </Stack>
    </Show>
  )
}

export default SelectionRenderer
