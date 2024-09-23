import "./collaboration.css"
import CollaborationIcon from "../../assets/icons/collaboration.svg"
import Tab from "./tab"
import { Match, Switch, useContext } from "solid-js"
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
                                All changes are shared directly between users with end-to-end encryption.
                            </div>
                        </div>
                        <button class="primary" onclick={yjsActions.startSession}>Start session</button>
                    </Match>
                    <Match when={yjs.room()}>
                        <div class="text-field">
                            <div class="text-field-label">Your name</div>
                            <input class="text-field-input" id="your-name" type="text" value={yjs.userName()} />
                        </div>
                        <div class="text-field">
                            <div class="text-field-label">Link</div>
                            <div class="row">
                                <input class="text-field-input" id="link" type="text" readonly value={yjsActions.getShareUrl()}
                                    onclick={(e) => {
                                        e.preventDefault()
                                        e.currentTarget.select()
                                    }}
                                />
                                <button
                                    class="primary"
                                    onclick={(e) => {
                                        e.preventDefault()
                                        navigator.clipboard.writeText((document.getElementById("link") as HTMLInputElement).value)
                                    }}>
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div class="tab-description">
                            <div>
                                If you end session, the changes will no longer be shared between you and other users.
                            </div>
                            <div>
                                They will be able to continue working on their own copy of the project.
                            </div>
                        </div>
                        <button
                            class="outline danger"
                            onclick={yjsActions.endSession}
                        >
                            End session
                        </button>
                    </Match>
                </Switch>
            </div>
        )
    }
}

export default Collaboration