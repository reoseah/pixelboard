import "./Menu.css"
import { JSXElement, Show } from "solid-js"
import CheckIcon from "../../assets/icons/check.svg"

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

const MenuOption = (props: {
    selected?: boolean
    onClick: () => void
    children: string
    disabled?: boolean
    title?: string
}) => {
    return (
        <button
            class={"menu-option"}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.title}
            aria-selected={props.selected}
        >
            <Show when={props.selected}>
                <CheckIcon />
            </Show>
            <span class="menu-option-label">
                {props.children}
            </span>
        </button>
    )
}

export default Object.assign(Menu, {
    Divider: MenuDivider,
    Option: MenuOption
})

