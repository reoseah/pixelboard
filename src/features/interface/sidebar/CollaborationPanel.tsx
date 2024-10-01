import { Match, Switch, useContext } from 'solid-js'

import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Stack from '../../../components/Stack'
import Text from '../../../components/Text'
import { YjsContext } from '../../../state/YjsContext'
import './CollaborationPanel.css'

const CollaborationPanel = () => {
  const yjs = useContext(YjsContext)

  return (
    <Stack padding={0.75} spacing={0.75}>
      <h2 class="tab-title">Live Collaboration</h2>
      <Switch>
        <Match when={!yjs.room()}>
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
          <Button color="primary" onclick={yjs.startSession}>Start session</Button>
        </Match>
        <Match when={yjs.room()}>
          <Stack spacing={0.25}>
            <Text size="medium">Your name</Text>
            <Input
              id="your-name"
              onchange={e => yjs.setUserName(e.currentTarget.value)}
              type="text"
              value={yjs.userName()}
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
                value={yjs.getShareUrl()}
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

          <Button color="danger" onclick={yjs.endSession} variant="outline">End session</Button>
        </Match>
      </Switch>
    </Stack>
  )
}

export default CollaborationPanel
