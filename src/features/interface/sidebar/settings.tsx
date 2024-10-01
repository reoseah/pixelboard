import Tab from "../../../api/sidebar/tab"
import Stack from "../../../components/Stack"
import SettingsIcon from "../../../assets/icons/settings.svg"

const Settings: Tab = {
    place: "bottom",
    label: "Settings",
    icon: SettingsIcon,
    contents: () => (
        <Stack spacing={.75} padding={.75}>
            Settings (work in progress)
        </Stack>
    )
}

export default Settings