import { useContext } from 'solid-js'

import YjsContext from '../../state/YjsContext'
import Button from '../generic/Button'
import Stack from '../generic/Stack'
import './MainMenuPanel.css'

const MainMenuPanel = () => {
  const yjs = useContext(YjsContext)

  const handleSave = async () => {
    const date = new Date()
    const name = `Untitled-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}.pixelboard`
    try {
      // @ts-expect-error-next-line new API, not in TypeSscript yet
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: name,
        types: [
          {
            description: 'Pixelboard document',
            accept: {
              'application/octet-stream': ['.pixelboard'],
            },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      const data = await yjs.serialize()
      await writable.write(data)
      await writable.close()
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (_) {
      const data = await yjs.serialize()
      const blob = new Blob([data], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Stack padding={0.75} spacing={0.75}>
      <Button onclick={handleSave}>
        Save
      </Button>
      <Button
        onclick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.pixelboard'
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
