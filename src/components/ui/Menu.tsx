import { JSXElement } from "solid-js"
import "./Menu.css"

const Menu = (props: {
    children: JSXElement,
    ref?: (el: HTMLElement) => void
}) => {
    return (
        <div class="menu" ref={props.ref}>
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

