import { WhiteboardElementType } from '../../types/whiteboard'
import FrameRenderer from './Frame'

export type FrameEntity = {
  height: number
  title: null | string
  type: 'crop'
  width: number
  x: number
  y: number
}

export const FrameType: WhiteboardElementType<FrameEntity> = {
  getBounds: crop => ({
    height: crop.height,
    width: crop.width,
    x: crop.x,
    y: crop.y,
  }),
  render: FrameRenderer,
}
