import { useContext, For } from 'solid-js'

import SaveIcon from '../../assets/icons/save.svg'
import RegistryContext from '../../state/RegistryContext'
import SavePropertiesContext, { formats } from '../../state/SavePropertiesContext'
import VirtualCanvasContext, { renderArea } from '../../state/VirtualCanvasContext'
import IconButton from '../generic/IconButton'
import Input from '../generic/Input'
import InputGroup from '../generic/InputGroup'
import { Select, Option } from '../generic/Select'

const SaveAreaControls = (props: {
  x: number
  y: number
  width: number
  height: number
  name: string
}) => {
  const registry = useContext(RegistryContext)
  const canvas = useContext(VirtualCanvasContext)
  const { scale, setScale, format, setFormat } = useContext(SavePropertiesContext)

  return (
    <InputGroup>
      <Select
        class="w-3.5rem"
        title="Export format"
        value={formats.find(option => option.value === format())?.label || 'Unknown'}
      >
        {close => (
          <For each={formats}>
            {option => (
              <Option
                onClick={() => {
                  setFormat(option.value)
                  close()
                }}
                selected={option.value === format()}
              >
                {option.label}
              </Option>
            )}
          </For>
        )}
      </Select>

      <Input
        class="w-2.5rem"
        onblur={(e) => {
          const value = parseFloat(e.currentTarget.value)
          if (!isNaN(value)) {
            setScale(value)
          }
        }}
        onfocus={(e) => {
          e.currentTarget.value = scale().toString()
          e.currentTarget.select()
        }}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            e.currentTarget.blur()
          }
        }}
        small
        title="Export scale"
        value={scale() + 'x'}
      />

      <IconButton
        onclick={() => {
          renderArea(
            canvas,
            registry.rasterElements,
            props.x,
            props.y,
            props.width,
            props.height,
            scale(),
          )
            .convertToBlob({
              quality: 1,
              type: format(),
            })
            .then((blob) => {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = props.name + '.' + format().split('/')[1]
              a.click()
              URL.revokeObjectURL(url)
            })
        }}
        title="Export selection"
      >
        <SaveIcon />
      </IconButton>
    </InputGroup>
  )
}

export default SaveAreaControls
