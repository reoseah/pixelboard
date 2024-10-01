import { Tab } from "../../../types/sidebar"
import CollaborationIcon from "../../../assets/icons/collaboration.svg"
import CollaborationPanel from "./CollaborationPanel"

const Collaboration: Tab = {
    place: "top",
    label: "Collaboration",
    icon: CollaborationIcon,
    contents: CollaborationPanel
}

export default Collaboration