import CollaborationIcon from '../../assets/icons/collaboration.svg'
import { Tab } from '../../types/tab'
import CollaborationPanel from '../../features/sidebar/CollaborationPanel'

const Collaboration: Tab = {
  contents: CollaborationPanel,
  icon: CollaborationIcon,
  label: 'Collaboration',
  place: 'top',
}

export default Collaboration
