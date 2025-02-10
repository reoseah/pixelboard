import ZoomIn from 'lucide-solid/icons/zoom-in'
import ZoomOut from 'lucide-solid/icons/zoom-out'
import ViewportPosition from '../state/viewport-position'

const ZoomButtons = () => {
	return (
		<div class="flex text-sm">
			<button
				class="group/tooltip-button relative grid cursor-pointer place-content-center rounded-l bg-neutral-800 p-1.5 text-neutral-200 hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-white"
				type="button"
				onclick={ViewportPosition.zoomOut}
			>
				<ZoomOut />
				<div class="absolute bottom-[calc(100%+.5rem)] hidden w-max rounded bg-neutral-950 px-2 py-1 group-hover/tooltip-button:block">
					Zoom out
				</div>
			</button>
			<button
				class="group/tooltip-button relative inline-flex cursor-pointer items-center justify-center bg-neutral-800 px-2 text-neutral-200 hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-white"
				type="button"
				onclick={ViewportPosition.resetZoom}
			>
				<span class="leading-none [text-box:trim-both_cap_alphabetic]">{ViewportPosition.scale() * 100}%</span>
				<div class="-translate-x-1/2 absolute bottom-[calc(100%+.5rem)] left-1/2 hidden w-max rounded bg-neutral-950 px-2 py-1 group-hover/tooltip-button:block">
					Reset zoom
				</div>
			</button>
			<button
				class="group/tooltip-button relative grid cursor-pointer place-content-center rounded-r bg-neutral-800 p-1.5 text-neutral-200 hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-white"
				type="button"
				onclick={ViewportPosition.zoomIn}
			>
				<ZoomIn />
				<div class="-translate-x-1/2 absolute bottom-[calc(100%+.5rem)] left-1/2 hidden w-max rounded bg-neutral-950 px-2 py-1 group-hover/tooltip-button:block">
					Zoom in
				</div>
			</button>
		</div>
	)
}

export default ZoomButtons
