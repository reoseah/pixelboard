import { type Accessor, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import CanvasObjects from '../../state/document/objects'
import ViewportPosition from '../../state/viewport-position'
import useMouseUpOutside from '../../util/useMouseUpOutside'
import type { ObjectHandler } from './types'

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
		key: string
		selected: boolean
		highlighted: boolean
	}) => {
		const { scale } = ViewportPosition

		const { titleBeingEdited, setTitleBeingEdited } = CanvasObjects

		return (
			<div
				class="group absolute outline outline-slice data-[highlighted=true]:z-5 data-[selected=true]:z-5 data-[highlighted=true]:outline-primary-500 data-[selected=true]:outline-2 data-[selected=true]:outline-primary-500"
				style={{
					left: `${props.instance.x * scale()}px`,
					top: `${props.instance.y * scale()}px`,
					width: `${props.instance.width * scale() - 1}px`,
					height: `${props.instance.height * scale() - 1}px`,
				}}
				data-highlighted={props.highlighted}
				data-selected={props.selected}
			>
				<Show
					when={titleBeingEdited() === props.key}
					fallback={
						<div
							class="-top-5.25 absolute left-0 z-10 w-min max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-neutral-400 text-xs group-data-[highlighted=true]:text-primary-400 group-data-[selected=true]:text-primary-400"
							ondblclick={() => setTitleBeingEdited(props.key)}
						>
							{props.instance.title ?? 'Slice'}
						</div>
					}
				>
					<TitleEditor key={props.key} initial={props.instance.title} />
				</Show>
			</div>
		)
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

	useMouseUpOutside(
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
