import { JSX } from 'solid-js'

import './InputGroup.css'

export const InputGroup = (props: {
  children: JSX.Element
}) => {
  return (
    <div class="input-group">
      {props.children}
    </div>
  )
}

export default InputGroup
