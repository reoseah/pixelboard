import type { WhiteboardElementType } from '../../types/whiteboard'

import FrameRenderer from '../../components/app/Frame'

export type FrameElement = {
  type: 'frame'
  title: null | string
  x: number
  y: number
  height: number
  width: number
}

const FrameElementType: WhiteboardElementType<FrameElement> = {
  render: FrameRenderer,
  getBounds: element => ({
    height: element.height,
    width: element.width,
    x: element.x,
    y: element.y,
  }),
  move: (element, dx, dy) => {
    return ({
      ...element,
      x: element.x + dx,
      y: element.y + dy,
    })
  },
  finishMove: element => ({
    ...element,
    x: Math.round(element.x),
    y: Math.round(element.y),
  }),
}

export default FrameElementType
