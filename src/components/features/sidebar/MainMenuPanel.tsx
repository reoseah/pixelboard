import "./MainMenuPanel.css"
import { useContext } from "solid-js"
import Stack from "../../ui/Stack"
import { YjsContext } from "../../../state/Yjs"
import Button from "../../ui/Button"

const MainMenuPanel = () => {
    const [yjs, yjsActions] = useContext(YjsContext)

    return (
        <Stack spacing={.75} padding={.75}>
            <Button
                onclick={() => {
                    yjsActions.serialize().then((data) => {
                        const blob = new Blob([data], { type: 'application/octet-stream' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'document.pixelwave'
                        a.click()
                    })
                }}
            >
                Save
            </Button>
            <Button
                onclick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pixelwave'
                    input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = (event) => {
                            yjsActions.deserialize(new Uint8Array(event.target?.result as ArrayBuffer))
                        }
                        reader.readAsArrayBuffer(file)
                    }
                    input.click()
                }}
            >
                Load
            </Button>
        </Stack>
    )
}

export default MainMenuPanel