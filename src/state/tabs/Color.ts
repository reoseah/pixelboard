import PaletteIcon from '../../assets/icons/palette.svg'
import { Tab } from '../../types/tab'
import ColorPanel from '../../features/sidebar/ColorPanel'

const Color: Tab = {
  contents: ColorPanel,
  icon: PaletteIcon,
  label: 'Color',
  place: 'top',
}

export default Color
