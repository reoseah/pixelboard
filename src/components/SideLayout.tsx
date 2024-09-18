import "./SideLayout.css"
import { JSXElement } from "solid-js"

const SideLayout = (props: { children: JSXElement }) => {
    return (
        <div class="side-layout">
            {props.children}
        </div>
    )
}

export default SideLayout