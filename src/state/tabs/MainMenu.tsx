import MenuIcon from '../../assets/icons/menu.svg'
import MainMenuPanel from '../../features/sidebar/MainMenuPanel'
import { Tab } from '../../types/tab'

const MainMenu: Tab = {
  contents: MainMenuPanel,
  icon: MenuIcon,
  label: 'Menu',
  place: 'top',
}

export default MainMenu
