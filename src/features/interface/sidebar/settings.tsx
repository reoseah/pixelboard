import SettingsIcon from '../../../assets/icons/settings.svg'
import Stack from '../../../components/Stack'
import { Tab } from '../../../types/tab'

const Settings: Tab = {
  contents: () => (
    <Stack padding={0.75} spacing={0.75}>
      Settings (work in progress)
    </Stack>
  ),
  icon: SettingsIcon,
  label: 'Settings',
  place: 'bottom',
}

export default Settings
