import "./collaboration.css"
import CollaborationIcon from "../../assets/icons/collaboration.svg"
import Tab from "./tab"
import { Match, Show, Switch, useContext } from "solid-js"
import { YjsContext } from "../../state/Yjs"

const Collaboration: Tab = {
    place: "top",
    label: "Collaboration",
    icon: CollaborationIcon,
    contents: () => {
        const [yjs, yjsActions] = useContext(YjsContext)

        return (
            <div class="tab">
                <h2 class="tab-title">Live Collaboration</h2>
                <Switch>
                    <Match when={!yjs.room()}>
                        <div class="tab-description">
                            <div>
                                Invite others to join your project and work together seamlessly.
                            </div>
                            <div>
                                Your drawing is fully private, all changes are shared directly with end-to-end encryption and not seen anywhere else.
                            </div>
                        </div>
                        <button class="primary" onclick={yjsActions.startSession}>Start session</button>
                    </Match>
                    <Match when={yjs.room()}>
                        <div class="text-field">
                            <div class="text-field-label">Your name</div>
                            <input class="text-field-input" id="your-name" type="text" />
                        </div>
                        {/* <div class="collaboration-tab-link-row"> */}
                        <div class="text-field">
                            <div class="text-field-label">Link</div>
                            <input id="link" type="text" readonly />
                        </div>
                        <button onclick={(e) => {
                            e.preventDefault()
                            navigator.clipboard.writeText((document.getElementById("link") as HTMLInputElement).value)
                        }}>Copy</button>
                        {/* </div> */}
                    </Match>
                </Switch>
            </div>
        )
    }
}

export default Collaboration