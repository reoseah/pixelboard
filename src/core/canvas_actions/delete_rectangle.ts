import { CanvasActionType } from "./canvas_action"

export type DeleteRectangle = {
    type: "delete_rectangle"
    x: number
    y: number
    width: number
    height: number
}

export const DeleteRectangleType: CanvasActionType<DeleteRectangle> = {
    getBounds: (action) => {
        return {
            x: action.x,
            y: action.y,
            width: action.width,
            height: action.height
        }
    },
    render: (action, helper) => {
        helper.clearRect(action.x, action.y, action.width, action.height)
    }
}