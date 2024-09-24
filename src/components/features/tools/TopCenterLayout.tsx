import "./TopCenterLayout.css"
import { JSXElement } from "solid-js"

const TopCenterLayout = (props: { children: JSXElement }) => {
    return (
        <div class="top-center-layout">
            {props.children}
        </div>
    )
}

export default TopCenterLayout