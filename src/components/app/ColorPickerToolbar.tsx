import { useContext } from 'solid-js'

import SelectedColorContext from '../../state/SelectedColorContext'
import ColorInput from '../generic/ColorInput'
import InputGroup from '../generic/InputGroup'
import Stack from '../generic/Stack'
import './PencilToolbar.css'

const ColorPickerToolbar = () => {
  const selectedColor = useContext(SelectedColorContext)

  return (
    <Stack class="island" direction="row" padding={0.1875} spacing={0.25}>
      <InputGroup>
        <ColorInput
          name="pencil-color"
          onChange={value => selectedColor.setHex(value)}
          title="Stroke color"
          value={selectedColor.hex()}
        />
      </InputGroup>
    </Stack>
  )
}

export default ColorPickerToolbar
