import CursorIcon from '../../assets/icons/cursor.svg'
import { Tool } from './tool'

export const createSelect = (): Tool => {
    return {
        label: "Select/Move",
        key: "V",
        icon: CursorIcon,
    }
}
