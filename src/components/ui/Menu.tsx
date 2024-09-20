import { JSXElement } from "solid-js"
import "./Menu.css"

const Menu = (props: {
    children: JSXElement
}) => {
    return (
        <div class="menu">
            {props.children}
        </div>
    )
}

const MenuDivider = () => {
    return (
        <div class="menu-divider" />
    )
}

export default Object.assign(Menu, {
    Divider: MenuDivider
})

