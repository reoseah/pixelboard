import { JSXElement } from "solid-js"
import "./TopCenterLayout.css"

const TopCenterLayout = (props: { children: JSXElement }) => {
    return (
        <div class="top-center-layout">
            {props.children}
        </div>
    )
}

export default TopCenterLayout