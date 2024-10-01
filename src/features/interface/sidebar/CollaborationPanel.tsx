import "./CollaborationPanel.css"
import { useContext, Switch, Match } from "solid-js"
import { YjsContext } from "../../../state/Yjs"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import Stack from "../../../components/Stack"
import Text from "../../../components/Text"

const CollaborationPanel = () => {
  const [yjs, yjsActions] = useContext(YjsContext)

  return (
    <Stack spacing={.75} padding={.75}>
      <h2 class="tab-title">Live Collaboration</h2>
      <Switch>
        <Match when={!yjs.room()}>
          <Stack spacing={.25}>
            <Text size="medium" muted>
              Invite others to join your project and work together seamlessly.
            </Text>
            {/* todo: make this true, y-webrtc doesn't encrypt things out of the box */}
            {/* <Text size="medium" muted>
                            All changes are shared directly between users with end-to-end encryption.
                        </Text> */}
          </Stack>
          {/* todo: add play icon / loading indicator to this button */}
          <Button color="primary" onclick={yjsActions.startSession}>Start session</Button>
        </Match>
        <Match when={yjs.room()}>
          <Stack spacing={.25}>
            <Text size="medium">Your name</Text>
            <Input id="your-name" type="text" value={yjs.userName()} onchange={(e) => yjsActions.setUserName(e.currentTarget.value)} />
          </Stack>
          <Stack spacing={.25}>
            <Text size="medium">Link</Text>
            <Stack direction="row" spacing={.5}>
              <Input id="link" type="text" readonly value={yjsActions.getShareUrl()}
                onclick={(e) => {
                  e.preventDefault()
                  e.currentTarget.select()
                }}
              />
              <Button color="primary"
                onclick={(e) => {
                  e.preventDefault()
                  navigator.clipboard.writeText((document.getElementById("link") as HTMLInputElement).value)
                }}>
                Copy
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={.25}>
            <Text size="medium" muted>
              If you end session, the changes will no longer be shared between you and other users.
            </Text>
            <Text size="medium" muted>
              They will be able to continue working on their own copy of the project.
            </Text>
          </Stack>

          <Button variant="outline" color="danger" onclick={yjsActions.endSession}>End session</Button>
        </Match>
      </Switch>
    </Stack>
  )
}

export default CollaborationPanel