import CollaborationIcon from '../../assets/icons/collaboration.svg'
import CollaborationPanel from '../../components/app/CollaborationPanel'
import { Tab } from '../../types/tab'

const Collaboration: Tab = {
  contents: CollaborationPanel,
  icon: CollaborationIcon,
  label: 'Collaboration',
  place: 'top',
}

export default Collaboration
