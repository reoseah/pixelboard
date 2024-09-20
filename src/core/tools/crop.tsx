import CropIcon from '../../assets/icons/crop.svg'
import Tool from './tool'

const createCrop = (): Tool => {
    return {
        label: "Frame/Crop",
        icon: CropIcon,
    }
}

export default createCrop