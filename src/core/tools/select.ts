import CursorIcon from '../../assets/icon/cursor.svg'
import { Tool } from './tool'

export const createSelect = (): Tool => {
    return {
        title: "Select/Move",
        key: "V",
        icon: CursorIcon,
    }
}
