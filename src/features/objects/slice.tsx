import { Show, createSignal, onMount } from 'solid-js'
import ObjectMoving from '../../state/document/object-moving'
import CanvasObjects from '../../state/document/objects'
import SelectedTool from '../../state/selected-tool'
import ViewportPosition from '../../state/viewport-position'
import useMouseDownOutside from '../../util/useMouseDownOutside'
import type { ObjectHandler } from './types'

export type ResizeDirection =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'

export type SliceInstance = {
	type: 'slice'
	title: null | string
	x: number
	y: number
	height: number
	width: number
}

export const SliceHandler: ObjectHandler<SliceInstance> = {
	getBounds: (instance) => ({
		x: instance.x,
		y: instance.y,
		height: instance.height,
		width: instance.width,
	}),
	move: (instance, dx, dy) => {
		return {
			...instance,
			x: instance.x + dx,
			y: instance.y + dy,
		}
	},
	finishMove: (instance) => ({
		...instance,
		x: Math.round(instance.x),
		y: Math.round(instance.y),
	}),
	render: (props: {
		instance: SliceInstance
		id: string
	}) => {
		const { scale } = ViewportPosition
		const { selection, highlight, titleBeingEdited, setTitleBeingEdited } = CanvasObjects
		const { moving } = ObjectMoving

		return (
			<div
				class="group absolute outline outline-slice data-[highlighted=true]:z-5 data-[selected=true]:z-5 data-[highlighted=true]:outline-primary-500 data-[selected=true]:outline-2 data-[selected=true]:outline-primary-500"
				style={{
					left: `${props.instance.x * scale()}px`,
					top: `${props.instance.y * scale()}px`,
					width: `${props.instance.width * scale() - 1}px`,
					height: `${props.instance.height * scale() - 1}px`,
				}}
				data-object-id={props.id}
				data-selected={selection().includes(props.id) && SelectedTool.id() === 'select'}
				data-highlighted={
					highlight().includes(props.id) || (selection().includes(props.id) && SelectedTool.id() !== 'select')
				}
			>
				<Show
					when={titleBeingEdited() === props.id}
					fallback={
						<div
							class="-top-5.25 absolute left-0 z-10 w-min max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-neutral-400 text-xs group-data-[highlighted=true]:text-primary-400 group-data-[selected=true]:text-primary-400"
							ondblclick={() => setTitleBeingEdited(props.id)}
						>
							{props.instance.title ?? 'Slice'}
						</div>
					}
				>
					<TitleEditor key={props.id} initial={props.instance.title} />
				</Show>
				<Show when={selection().includes(props.id) && SelectedTool.id() === 'select' && !moving()}>
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
	},
	handleMouseDown: (tool, event) => {
		if (event.target instanceof HTMLElement) {
			if (event.target.hasAttribute('data-resize-handle')) {
				return { cancel: true }
			}
		}

		return { cancel: false }
	},
}

const TitleEditor = (props: {
	key: string
	initial: string | null
}) => {
	const { instances, setTitleBeingEdited } = CanvasObjects

	const [value, setValue] = createSignal(props.initial ?? 'Slice')

	let input!: HTMLInputElement
	let widthHelper!: HTMLSpanElement

	const updateTitle = () => {
		instances.set(props.key, {
			...instances.get(props.key),
			title: value().trim() || null,
		} as SliceInstance)
		setTitleBeingEdited(null)
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
						setTitleBeingEdited(null)
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
			class="pointer-events-auto absolute h-2 w-2 border-2 border-primary-500 bg-white"
			classList={{
				'-top-1.25 left-[calc(50%-0.25rem)] cursor-ns-resize': props.position === 'top',
				'-bottom-1.25 left-[calc(50%-0.25rem)] cursor-ns-resize': props.position === 'bottom',
				'top-[calc(50%-0.25rem)] -left-1.25  cursor-ew-resize': props.position === 'left',
				'top-[calc(50%-0.25rem)] -right-1.25  cursor-ew-resize': props.position === 'right',
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
