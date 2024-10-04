import { createSignal, JSX, onMount, Show, useContext } from 'solid-js'

import useClickOutside from '../../hooks/useClickOutside'
import SelectedToolContext from '../../state/SelectedToolContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import { FrameElement } from '../../state/whiteboard_elements/FrameElementType'
import WhiteboardElementsContext from '../../state/WhiteboardElementsContext'
import './Frame.css'

const Frame = (props: {
  element: FrameElement
  id: string
}) => {
  const viewport = useContext(ViewportPositionContext)
  const whiteboard = useContext(WhiteboardElementsContext)
  return (
    <div
      class="frame"
      data-element-id={props.id}
      data-selectable
      data-selected={whiteboard.selected().includes(props.id)}
      style={{
        height: `${props.element.height * viewport.scale()}px`,
        left: `${props.element.x * viewport.scale()}px`,
        top: `${props.element.y * viewport.scale()}px`,
        width: `${props.element.width * viewport.scale()}px`,
      }}
    >
      <Show
        fallback={<FrameTitle id={props.id} node={props.element} />}
        when={whiteboard.editingTitle() === props.id}
      >
        <FrameTitleEditor id={props.id} node={props.element} />
      </Show>
    </div>
  )
}

export default Frame

const FrameTitle = (props: {
  id: string
  node: FrameElement
}) => {
  const whiteboard = useContext(WhiteboardElementsContext)
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
          whiteboard.setEditingTitle(props.id)
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
  const whiteboard = useContext(WhiteboardElementsContext)
  let input!: HTMLInputElement
  let widthHelper!: HTMLSpanElement

  const updateTitle = () => {
    whiteboard.set(props.id, {
      ...props.node,
      title: value().trim() || null,
    })

    whiteboard.setEditingTitle(null)
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
            whiteboard.setEditingTitle(null)
          }
        }}
        ref={el => input = el}
        type="text"
        value={value()}
      />
    </>
  )
}
