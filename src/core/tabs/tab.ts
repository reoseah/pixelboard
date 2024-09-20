import { Component } from "solid-js"

type Tab = {
    place: "top" | "bottom"
    label: string,
    icon: Component,
    contents: Component
}

export default Tab