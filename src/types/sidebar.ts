import { Component } from "solid-js"

export type Tab = {
    place: "top" | "bottom"
    label: string,
    icon: Component,
    contents: Component
}
