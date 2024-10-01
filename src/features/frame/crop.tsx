import { EntityType } from '../../types/whiteboard'
import CropRenderer from './CropRenderer'

export type Crop = {
  height: number
  title: null | string
  type: 'crop'
  width: number
  x: number
  y: number
}

export const CropType: EntityType<Crop> = {
  getBounds: crop => ({
    height: crop.height,
    width: crop.width,
    x: crop.x,
    y: crop.y,
  }),
  render: CropRenderer,
}
