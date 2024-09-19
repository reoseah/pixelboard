import CursorIcon from '../../assets/icons/cursor.svg'
import Tool from './tool'

const createSelect = (): Tool => {
    return {
        label: "Select/Move",
        icon: CursorIcon,
    }
}

export default createSelect
