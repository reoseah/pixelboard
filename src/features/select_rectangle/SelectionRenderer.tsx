import "./SelectionRenderer.css"
import { createMemo, createSignal, For, Show, useContext } from "solid-js"
import SaveIcon from "../../assets/icons/save.svg"
import { ViewportPositionContext } from "../../api/ViewportPositionContext"
import { VirtualCanvasContext } from "../../api/canvas/VirtualCanvasContext"
import IconButton from "../../components/IconButton"
import Input from "../../components/Input"
import InputGroup from "../../components/InputGroup"
import Stack from "../../components/Stack"
import { Select, Option } from "../../components/Select"
import CanvasSelectionContext from "../../api/canvas/CanvasSelectionContext"

const saveFormats = [
  { value: "image/png", label: "PNG" },
  // { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
]

const SelectionRenderer = () => {
  const viewport = useContext(ViewportPositionContext)
  const selection = useContext(CanvasSelectionContext)
  const canvas = useContext(VirtualCanvasContext)
  const bounds = createMemo(selection.getBounds)

  const [saveScale, setSaveScale] = createSignal(1)
  const [saveFormat, setSaveFormat] = createSignal("image/png")

  return (
    <Show when={selection.parts.length !== 0}>
      <svg
        class="selection-renderer"
        width={bounds().width * viewport.scale() + 1}
        height={bounds().height * viewport.scale() + 1}
        style={{
          left: `${bounds().x * viewport.scale()}px`,
          top: `${bounds().y * viewport.scale()}px`,
        }}
      >
        <For each={selection.parts}>
          {(part) => (
            <Show when={part.type === "rectangle"}>
              <rect
                x={part.x - bounds().x + .5}
                y={part.y - bounds().y + .5}
                width={part.width * viewport.scale()}
                height={part.height * viewport.scale()}
                fill="none"
                stroke="black"
                stroke-dasharray="3 3"
                stroke-dashoffset="0"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="6" dur=".5s" repeatCount="indefinite" />
              </rect>
              <rect
                x={part.x - bounds().x + .5}
                y={part.y - bounds().y + .5}
                width={part.width * viewport.scale()}
                height={part.height * viewport.scale()}
                fill="none"
                stroke="white"
                stroke-dasharray="3 3"
                stroke-dashoffset="3"
              >
                <animate attributeName="stroke-dashoffset" from="3" to="9" dur=".5s" repeatCount="indefinite" />
              </rect>
            </Show>
          )}
        </For>
      </svg>
      <Stack
        class="island"
        spacing={.25}
        padding={.1875}
        direction="row"
        style={{
          position: "absolute",
          left: `${bounds().x * viewport.scale() + bounds().width * viewport.scale() / 2}px`,
          top: `${bounds().y * viewport.scale() + bounds().height * viewport.scale() + 8}px`,
          transform: "translate(-50%, 0)",
        }}
      >
        <InputGroup>
          <Select
            value={saveFormats.find(format => format.value === saveFormat())?.label || "Unknown"}
            class="w-3.5rem"
            title="Export format"
          >
            {(close) => (
              <For each={saveFormats}>
                {(format) => (
                  <Option
                    selected={format.value === saveFormat()}
                    onClick={() => {
                      setSaveFormat(format.value)
                      close()
                    }}
                  >
                    {format.label}
                  </Option>
                )}
              </For>
            )}
          </Select>

          <Input
            small
            class="w-2.5rem"
            title="Export scale"
            value={saveScale() + "x"}
            onfocus={(e) => {
              e.currentTarget.value = saveScale().toString()
              e.currentTarget.select()
            }}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.currentTarget.blur()
              }
            }}
            onblur={(e) => {
              const value = parseFloat(e.currentTarget.value)
              if (!isNaN(value)) {
                setSaveScale(value)
              }
            }}
          />

          <IconButton
            title="Export selection"
            onclick={() => {
              canvas.renderArea(
                bounds().x,
                bounds().y,
                bounds().width,
                bounds().height,
                saveScale(),
                {
                  type: saveFormat(),
                  quality: 1
                }
              ).then(blob => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = "selection." + saveFormat().split("/")[1]
                a.click()
                URL.revokeObjectURL(url)
              })
            }}
          >
            <SaveIcon />
          </IconButton>
        </InputGroup>
      </Stack>
    </Show>
  )
}

export default SelectionRenderer