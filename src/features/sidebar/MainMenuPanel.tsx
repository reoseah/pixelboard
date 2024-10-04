import { useContext } from 'solid-js'

import Button from '../../components/generic/Button'
import Stack from '../../components/generic/Stack'
import YjsContext from '../../state/YjsContext'
import './MainMenuPanel.css'

const MainMenuPanel = () => {
  const yjs = useContext(YjsContext)

  return (
    <Stack padding={0.75} spacing={0.75}>
      <Button
        onclick={() => {
          yjs.serialize().then((data) => {
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
              yjs.deserialize(new Uint8Array(event.target?.result as ArrayBuffer))
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
