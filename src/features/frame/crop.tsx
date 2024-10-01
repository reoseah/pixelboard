import { EntityType } from "../../types/whiteboard"
import CropRenderer from "./CropRenderer"

export type Crop = {
    type: "crop",
    x: number,
    y: number,
    width: number,
    height: number
    title: string | null
}

export const CropType: EntityType<Crop> = {
    render: CropRenderer,
    getBounds: (crop) => ({
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height
    }),
}