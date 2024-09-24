import Tab from "./tab"
import CollaborationIcon from "../../assets/icons/collaboration.svg"
import CollaborationPanel from "../../components/features/sidebar/CollaborationPanel"

const Collaboration: Tab = {
    place: "top",
    label: "Collaboration",
    icon: CollaborationIcon,
    contents: CollaborationPanel
}

export default Collaboration