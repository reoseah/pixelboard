import CropRenderer from "../../components/features/viewport/CropRenderer"
import { BoardElementType } from "./board_element"

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