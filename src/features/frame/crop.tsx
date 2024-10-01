import { BoardElementType } from "../../api/board_element"
import CropRenderer from "./CropRenderer"

export type Crop = {
    type: "crop",
    x: number,
    y: number,
    width: number,
    height: number
    title: string | null
}

export const CropType: BoardElementType<Crop> = {
    render: CropRenderer,
    getBounds: (crop) => ({
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height
    }),
}