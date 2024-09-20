import SettingsIcon from "../../assets/icons/settings.svg"
import Tab from "./tab"

const Settings: Tab = {
    place: "bottom",
    label: "Settings",
    icon: SettingsIcon,
    contents: () => <>Settings</>
}

export default Settings