import "./Sidebar.css"
import { Component, createSignal, For, Show } from "solid-js"
import MenuIcon from "../assets/icons/menu.svg"
import PaletteIcon from "../assets/icons/palette.svg"
import SettingsIcon from "../assets/icons/settings.svg"
import { Dynamic } from "solid-js/web"
import { CustomOption, SelectBox } from "./ui/SelectBox"

type SidebarTab = {
    place: "top" | "bottom"
    icon: Component,
    contents: Component
}

const tabs: Record<string, SidebarTab> = {
    "menu": {
        place: "top",
        icon: MenuIcon,
        contents: () => (
            <>
                ssdgdsg
            </>
        )
    },
    "color": {
        place: "top",
        icon: PaletteIcon,
        contents: () => {
            return (
                <div
                    style={{
                        "padding": ".5rem",
                        display: "flex",
                        "flex-direction": "column",
                        // gap: ".5rem"
                    }}
                >
                    <SelectBox
                        value={"RGB"}
                        class="heading-select"
                    >
                        {(close) => {
                            return (
                                <>
                                    <CustomOption selected={true} value="RGB" onClick={close}>RGB</CustomOption>
                                    <CustomOption value="HSL" onClick={close}>HSL</CustomOption>
                                </>
                            )
                        }}
                    </SelectBox>
                    <div
                        style={{
                            "background": "linear-gradient(transparent, black), linear-gradient(90deg, white, red)",
                            width: "100%",
                            "aspect-ratio": "1/1",
                            "margin-top": ".25rem",
                            position: "relative"
                        }}
                    >

                        <div
                            style={{
                                position: "absolute",
                            }}
                        ></div>
                    </div>
                    <div
                        style={{
                            "background": "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)",
                            height: "1rem",
                            "margin-top": ".5rem"
                        }}
                    ></div>
                </div>
            )
        }
    },
    "settings": {
        place: "bottom",
        icon: SettingsIcon,
        contents: () => <>Settings</>
    }
}

const Sidebar = () => {
    const [openedTab, setOpenedTab] = createSignal<string | null>(null)

    const handleClick = (activityId: string) => {
        if (openedTab() === activityId) {
            setOpenedTab(null)
            return
        }
        setOpenedTab(activityId)
    }

    return (
        <div class="side-layout">
            <div class="sidebar">
                <div class="sidebar-tabs">
                    <div class="sidebar-tab-group">
                        <For each={Object.entries(tabs).filter(([_, tab]) => tab.place === "top")}>
                            {([activityId, activity]) => (
                                <button
                                    class="sidebar-tab"
                                    aria-pressed={openedTab() === activityId}
                                    onclick={() => handleClick(activityId)}
                                >
                                    <activity.icon />
                                </button>
                            )}
                        </For>
                    </div>
                    <div class="sidebar-tab-group">
                        <For each={Object.entries(tabs).filter(([_, activity]) => activity.place === "bottom")}>
                            {([activityId, activity]) => (
                                <button
                                    class="sidebar-tab"
                                    aria-pressed={openedTab() === activityId}
                                    onclick={() => handleClick(activityId)}
                                >
                                    <activity.icon />
                                </button>
                            )}
                        </For>
                    </div>
                </div>
                <Show when={openedTab()}>
                    <div class="sidebar-divider"></div>
                    <div class="sidebar-content">
                        <Dynamic component={tabs[openedTab()!].contents} />
                    </div>
                </Show>
            </div>
        </div>
    )
}

export default Sidebar