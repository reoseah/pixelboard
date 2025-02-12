import { Show, createSignal, onMount } from 'solid-js'
import type { SliceInstance } from '../features/objects/slice'
import type { ObjectHandler } from '../features/objects/types'
import ObjectBeingRenamed from '../state/document/object-being-renamed'
import ObjectMoving from '../state/document/object-moving'
import type { ResizeDirection } from '../state/document/object-resizing'
import CanvasObjects from '../state/document/objects'
import SelectedTool from '../state/selected-tool'
import ViewportPosition from '../state/viewport-position'
import useMouseDownOutside from '../util/useMouseDownOutside'

const Slice: ObjectHandler<SliceInstance>['render'] = (props: {
	instance: SliceInstance
	id: string
}) => {
	const { scale } = ViewportPosition
	const { selection, highlight } = CanvasObjects
	const { moving } = ObjectMoving

	const inSelectiongMode = () => SelectedTool.id() === 'select'
	const selected = () => selection().includes(props.id)
	const highlighted = () => highlight().includes(props.id)
	const beingRenamed = () => ObjectBeingRenamed.id() === props.id

	return (
		<div
			class="group absolute outline outline-slice data-[highlighted=true]:z-5 data-[selected=true]:z-10 data-[selected=true]:cursor-move data-[highlighted=true]:outline-primary-500 data-[selected=true]:outline-2 data-[selected=true]:outline-primary-500"
			style={{
				left: `${props.instance.x * scale()}px`,
				top: `${props.instance.y * scale()}px`,
				width: `${props.instance.width * scale() - 1}px`,
				height: `${props.instance.height * scale() - 1}px`,
			}}
			data-object-id={props.id}
			data-selected={selected() && inSelectiongMode()}
			data-highlighted={highlighted() || (selected() && !inSelectiongMode())}
		>
			<Show when={beingRenamed()} fallback={<Title title={props.instance.title} />}>
				<TitleEditor key={props.id} initial={props.instance.title} />
			</Show>
			<Show when={selected() && inSelectiongMode() && !moving()}>
				<ResizeHandle position="top" />
				<ResizeHandle position="bottom" />
				<ResizeHandle position="left" />
				<ResizeHandle position="right" />
				<ResizeHandle position="top-left" />
				<ResizeHandle position="top-right" />
				<ResizeHandle position="bottom-left" />
				<ResizeHandle position="bottom-right" />
			</Show>
		</div>
	)
}

export default Slice

const Title = (props: { title: string | null }) => {
	return (
		<div
			class="-top-5.25 absolute left-0 z-5 w-min max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-neutral-400 text-xs group-data-[selected=true]:cursor-text group-data-[highlighted=true]:text-primary-400 group-data-[selected=true]:text-primary-400"
			data-renamable-title
		>
			{props.title ?? 'Slice'}
		</div>
	)
}

const TitleEditor = (props: {
	key: string
	initial: string | null
}) => {
	const [value, setValue] = createSignal(props.initial ?? 'Slice')

	let input!: HTMLInputElement
	let widthHelper!: HTMLSpanElement

	const updateTitle = () => {
		CanvasObjects.instances.set(props.key, {
			...(CanvasObjects.instances.get(props.key) as SliceInstance),
			title: value().trim() || null,
		} satisfies SliceInstance)
		ObjectBeingRenamed.clear()
	}

	onMount(() => {
		input.focus()
		input.select()
		updateWidth()
	})

	useMouseDownOutside(
		() => input,
		() => {
			updateTitle()
		},
	)

	const updateWidth = () => {
		widthHelper.innerText = value()
		input.style.width = `${widthHelper.offsetWidth}px`
	}

	return (
		<>
			<span
				class="invisible absolute whitespace-pre text-xs"
				ref={(el) => {
					widthHelper = el
				}}
			/>
			<input
				class="-left-1.25 -top-6 absolute box-content max-w-full rounded-sm border border-primary-400 bg-neutral-800 px-1 py-0.5 text-white text-xs outline-none"
				type="text"
				autocomplete="off"
				name="slice-title-editor"
				id="slice-title-editor"
				value={value()}
				onBlur={updateTitle}
				onChange={updateTitle}
				onInput={(e) => {
					setValue(e.currentTarget.value)
					updateWidth()
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						updateTitle()
					} else if (e.key === 'Escape') {
						ObjectBeingRenamed.clear()
					}
				}}
				ref={(el) => {
					input = el
				}}
			/>
		</>
	)
}

const ResizeHandle = (props: {
	position: ResizeDirection
}) => {
	return (
		<div
			class="pointer-events-auto absolute z-100 h-2 w-2 border-2 border-primary-500 bg-white"
			classList={{
				'-top-1.25 left-[calc(50%-var(--spacing))] cursor-ns-resize': props.position === 'top',
				'-bottom-1.25 left-[calc(50%-var(--spacing))] cursor-ns-resize': props.position === 'bottom',
				'top-[calc(50%-var(--spacing))] -left-1.25  cursor-ew-resize': props.position === 'left',
				'top-[calc(50%-var(--spacing))] -right-1.25  cursor-ew-resize': props.position === 'right',
				'-top-1.25 -left-1.25 cursor-nwse-resize': props.position === 'top-left',
				'-top-1.25 -right-1.25 cursor-nesw-resize': props.position === 'top-right',
				'-bottom-1.25 -left-1.25 cursor-nesw-resize': props.position === 'bottom-left',
				'-bottom-1.25 -right-1.25 cursor-nwse-resize': props.position === 'bottom-right',
			}}
			data-resize-handle
			data-resize-direction={props.position}
		/>
	)
}
