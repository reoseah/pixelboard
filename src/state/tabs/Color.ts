import PaletteIcon from '../../assets/icons/palette.svg'
import ColorPanel from '../../components/app/ColorPanel'
import { Tab } from '../../types/tab'

const Color: Tab = {
  contents: ColorPanel,
  icon: PaletteIcon,
  label: 'Color',
  place: 'top',
}

export default Color
