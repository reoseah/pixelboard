import { RasterElementType } from '../../types/raster_elements.ts'

// This is temporary until we have a proper canvas selection implementation,
// at which point this can be substituted with a more advanced DeleteSelection
export type DeleteRectangle = {
  height: number

  type: 'delete_rectangle'
  width: number
  x: number
  y: number
}

export const DeleteRectangleType: RasterElementType<DeleteRectangle> = {
  getBounds: (action) => {
    return {
      height: action.height,
      width: action.width,
      x: action.x,
      y: action.y,
    }
  },
  render: (action, helper) => {
    helper.clearRect(action.x, action.y, action.width, action.height)
  },
}
