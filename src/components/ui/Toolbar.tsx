import "./Toolbar.css"
import { JSXElement } from "solid-js"

const Toolbar = (props: { children: JSXElement }) => <div class="toolbar">{props.children}</div>

export default Toolbar