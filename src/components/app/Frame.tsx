import { createSignal, JSX, onMount, Show, useContext } from 'solid-js'

import useClickOutside from '../../hooks/useClickOutside'
import { FrameElement } from '../../state/non_raster_elements/FrameElementType'
import NonRasterElementsContext from '../../state/NonRasterElementsContext'
import SelectedToolContext from '../../state/SelectedToolContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import Stack from '../generic/Stack'
import './Frame.css'
import SaveAreaControls from './SaveAreaControls'

const Frame = (props: {
  element: FrameElement
  id: string
}) => {
  const viewport = useContext(ViewportPositionContext)
  const whiteboard = useContext(NonRasterElementsContext)
  const selectedTool = useContext(SelectedToolContext)

  return (
    <>
      <div
        class="frame"
        data-element-id={props.id}
        data-selectable
        data-selected={whiteboard.selected().includes(props.id)}
        data-highlighted={whiteboard.highlighted().includes(props.id)}
        style={{
          height: `${props.element.height * viewport.scale()}px`,
          left: `${props.element.x * viewport.scale()}px`,
          top: `${props.element.y * viewport.scale()}px`,
          width: `${props.element.width * viewport.scale()}px`,
        }}
      >
        <Show
          fallback={<FrameTitle id={props.id} node={props.element} />}
          when={whiteboard.titleBeingEdited() === props.id}
        >
          <FrameTitleEditor id={props.id} node={props.element} />
        </Show>
      </div>
      <Show when={whiteboard.selected().includes(props.id) && selectedTool.id() === 'select'}>
        <Stack
          class="island"
          direction="row"
          padding={0.1875}
          spacing={0.25}
          style={{
            position: 'absolute',
            left: `${props.element.x * viewport.scale() + props.element.width * viewport.scale() / 2}px`,
            top: `${props.element.y * viewport.scale() + props.element.height * viewport.scale() + 8}px`,
            transform: 'translate(-50%, 0)',
          }}
        >
          <SaveAreaControls
            x={props.element.x}
            y={props.element.y}
            width={props.element.width}
            height={props.element.height}
            name={props.element.title ?? 'Frame'}
          />
        </Stack>
      </Show>
    </>
  )
}

export default Frame

const FrameTitle = (props: {
  id: string
  node: FrameElement
}) => {
  const whiteboard = useContext(NonRasterElementsContext)
  const selectedTool = useContext(SelectedToolContext)!

  const style = (): JSX.CSSProperties => ({
    'pointer-events': selectedTool.id() === 'select' ? 'auto' : 'none',
  })

  return (
    <div
      class="frame-title"
      data-element-title
      onDblClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (selectedTool.id() === 'select') {
          whiteboard.setTitleBeingEdited(props.id)
        }
      }}
      style={style()}
    >
      {props.node.title ?? 'Frame'}
    </div>
  )
}

const FrameTitleEditor = (props: {
  id: string
  node: FrameElement
}) => {
  const [value, setValue] = createSignal(props.node.title ?? 'Frame')
  const whiteboard = useContext(NonRasterElementsContext)
  let input!: HTMLInputElement
  let widthHelper!: HTMLSpanElement

  const updateTitle = () => {
    whiteboard.set(props.id, {
      ...props.node,
      title: value().trim() || null,
    })

    whiteboard.setTitleBeingEdited(null)
  }

  onMount(() => {
    input.focus()
    input.select()
    updateWidth()
  })

  useClickOutside(() => input, () => {
    updateTitle()
  })

  const updateWidth = () => {
    widthHelper.innerText = value()
    input.style.width = `${widthHelper.offsetWidth}px`
  }

  return (
    <>
      <span
        ref={el => widthHelper = el}
        style={{
          'font-size': '.75rem',
          'position': 'absolute',
          'visibility': 'hidden',
          'white-space': 'pre',
        }}
      />
      <input
        autocomplete="off"
        class="frame-title-editor"
        onBlur={updateTitle}
        onChange={updateTitle}
        onInput={(e) => {
          setValue(e.currentTarget.value)
          updateWidth()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') updateTitle()
          if (e.key === 'Escape') {
            setValue(props.node.title ?? 'Frame')
            whiteboard.setTitleBeingEdited(null)
          }
        }}
        ref={el => input = el}
        type="text"
        value={value()}
      />
    </>
  )
}
