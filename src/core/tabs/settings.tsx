import Tab from "./tab"
import SettingsIcon from "../../assets/icons/settings.svg"
import Stack from "../../components/ui/Stack"

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