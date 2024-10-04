import { createSignal, JSXElement, onCleanup, useContext } from 'solid-js'

import SelectedToolContext from '../../state/SelectedToolContext'
import { ViewportPositionContext } from '../../state/ViewportPositionContext'
import './ViewportContainer.css'

const ViewportContainer = (props: { children: JSXElement }) => {
  const viewport = useContext(ViewportPositionContext)
  const selectedTool = useContext(SelectedToolContext)!
  const { innerHeight, innerWidth } = useInnerSize()

  const [dragging, setDragging] = createSignal(false)
  let type: 'space' | 'wheel' | null = null

  const handleMouseDown = (e: MouseEvent) => {
    if (shouldSkipInteraction(e)) {
      return
    }
    if (e.button === 1 && type === null) {
      setDragging(true)
      type = 'wheel'
    }
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging()) {
      viewport.move(e.movementX / viewport.scale(), e.movementY / viewport.scale())
    }
  }
  const handleMouseUp = () => {
    if (dragging() && type === 'wheel') {
      setDragging(false)
      type = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (shouldSkipInteraction(e)) {
      return
    }
    if (e.key === ' ' && type === null) {
      type = 'space'
      setDragging(true)
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === ' ' && type === 'space') {
      setDragging(false)
      type = null
    }
  }

  const handleWheel = (e: WheelEvent) => {
    if (shouldSkipInteraction(e) || dragging()) {
      return
    }
    if (e.ctrlKey) {
      e.preventDefault()
      if (e.deltaY < 0) {
        viewport.zoomIn()
      }
      else {
        viewport.zoomOut()
      }
    }
    else {
      const change = e.deltaY / viewport.scale()
      if (e.shiftKey) {
        viewport.move(change, 0)
      }
      else {
        viewport.move(0, change)
      }
    }
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  document.addEventListener('wheel', handleWheel, { passive: false })

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
    document.removeEventListener('wheel', handleWheel)
  })

  const translationX = () => Math.round(innerWidth() / 2 + viewport.x() * viewport.scale())
  const translationY = () => Math.round(innerHeight() / 2 + viewport.y() * viewport.scale())

  return (
    <div
      class="viewport"
      data-active-tool={selectedTool.id()}
      data-dragging={dragging()}
      onMouseDown={handleMouseDown}
    >
      <svg
        class="viewport-pixel-grid"
        data-hidden={viewport.scale() < 10}
        height={innerHeight()}
        width={innerWidth()}
      >
        <defs>
          <pattern
            height={viewport.scale()}
            id="pixel-grid-pattern"
            patternUnits="userSpaceOnUse"
            width={viewport.scale()}
          >
            <rect fill="var(--neutral-675)" height="1" width="1" />
          </pattern>
        </defs>
        <rect
          fill="url(#pixel-grid-pattern)"
          height="100%"
          transform={`translate(${translationX() % viewport.scale()} ${translationY() % viewport.scale()})`}
          width="100%"
        />
      </svg>
      <div style={{
        transform: `translate(${translationX()}px, ${translationY()}px)`,
      }}
      >
        {props.children}
      </div>
    </div>
  )
}

export default ViewportContainer

const useInnerSize = () => {
  const [innerWidth, setInnerWidth] = createSignal(window.innerWidth)
  const [innerHeight, setInnerHeight] = createSignal(window.innerHeight)

  const updateInnerSize = () => {
    setInnerWidth(window.innerWidth)
    setInnerHeight(window.innerHeight)
  }
  window.addEventListener('resize', updateInnerSize)
  onCleanup(() => window.removeEventListener('resize', updateInnerSize))

  return { innerHeight, innerWidth }
}

const shouldSkipInteraction = (e: KeyboardEvent | MouseEvent): boolean => {
  const target = e.target as HTMLElement
  const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  if (isEditable) {
    return true
  }

  return false
}
