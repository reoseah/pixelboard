// import "./collaboration.css"
import CollaborationIcon from "../../assets/icons/collaboration.svg"
import Tab from "./tab"

const Collaboration: Tab = {
    place: "top",
    label: "Collaboration",
    icon: CollaborationIcon,
    contents: () => (
        <div class="collaboration-tab">
            Collaboration (WIP)
        </div>
    )
}

export default Collaboration