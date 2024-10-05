import { Match, Switch, useContext } from 'solid-js'

import YWebrtcContext from '../../state/YWebrtcContext'
import Button from '../generic/Button'
import Input from '../generic/Input'
import Stack from '../generic/Stack'
import Text from '../generic/Text'
import './CollaborationPanel.css'

const CollaborationPanel = () => {
  const webrtc = useContext(YWebrtcContext)

  return (
    <Stack padding={0.75} spacing={0.75}>
      <h2 class="tab-title">Live Collaboration</h2>
      <Switch>
        <Match when={!webrtc.room()}>
          <Stack spacing={0.25}>
            <Text muted size="medium">
              Invite others to join your project and work together seamlessly.
            </Text>
            {/* todo: make this true, y-webrtc doesn't encrypt things out of the box */}
            {/* <Text size="medium" muted>
                            All changes are shared directly between users with end-to-end encryption.
                        </Text> */}
          </Stack>
          {/* todo: add play icon / loading indicator to this button */}
          <Button color="primary" onclick={webrtc.startSession}>Start session</Button>
        </Match>
        <Match when={webrtc.room()}>
          <Stack spacing={0.25}>
            <Text size="medium">Your name</Text>
            <Input
              id="your-name"
              onchange={e => webrtc.setUserName(e.currentTarget.value)}
              type="text"
              value={webrtc.userName()}
            />
          </Stack>
          <Stack spacing={0.25}>
            <Text size="medium">Link</Text>
            <Stack direction="row" spacing={0.5}>
              <Input
                id="link"
                onclick={(e) => {
                  e.preventDefault()
                  e.currentTarget.select()
                }}
                readonly
                type="text"
                value={webrtc.getShareUrl()}
              />
              <Button
                color="primary"
                onclick={(e) => {
                  e.preventDefault()
                  navigator.clipboard.writeText((document.getElementById('link') as HTMLInputElement).value)
                }}
              >
                Copy
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={0.25}>
            <Text muted size="medium">
              If you end session, the changes will no longer be shared between you and other users.
            </Text>
            <Text muted size="medium">
              They will be able to continue working on their own copy of the project.
            </Text>
          </Stack>

          <Button color="danger" onclick={webrtc.endSession} variant="outline">End session</Button>
        </Match>
      </Switch>
    </Stack>
  )
}

export default CollaborationPanel
