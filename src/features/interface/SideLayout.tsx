import { JSXElement } from 'solid-js'

import './SideLayout.css'

const SideLayout = (props: { children: JSXElement }) => {
  return (
    <div class="side-layout">
      {props.children}
    </div>
  )
}

export default SideLayout
