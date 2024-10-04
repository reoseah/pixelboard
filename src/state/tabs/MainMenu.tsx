import MenuIcon from '../../assets/icons/menu.svg'
import { Tab } from '../../types/tab'
import MainMenuPanel from '../../features/sidebar/MainMenuPanel'

const MainMenu: Tab = {
  contents: MainMenuPanel,
  icon: MenuIcon,
  label: 'Menu',
  place: 'top',
}

export default MainMenu
