import { CanvasActionType } from "./canvas_action"

export type PencilStroke = {
    type: "pencil"
    points: Array<{ x: number, y: number }>
    shape: "circle" | "square"
    size: number
}

const interval = 1 // TODO: Make this configurable by the user

export const PencilStrokeType: CanvasActionType<PencilStroke> = {
    getBounds: (action) => {
        const x = Math.min(...action.points.map((point) => point.x))
        const y = Math.min(...action.points.map((point) => point.y))
        const maxX = Math.max(...action.points.map((point) => point.x))
        const maxY = Math.max(...action.points.map((point) => point.y))

        return { x, y, width: maxX - x, height: maxY - y }
    },
    render: (action, helper) => {
        if (action.points.length === 1) {
            const { x, y } = action.points[0]

            const visited = new Map<number, Set<number>>()
            drawShape(action.shape, action.size, x, y, visited)
            visited.forEach((set, x) => {
                set.forEach((y) => {
                    helper.set(x, y, 0xffffffff)
                })
            })
            return
        }

        const { shape, size } = action

        const visited = new Map<number, Set<number>>()
        getPointsOnPath(action.points, interval).forEach((point) => {
            drawShape(shape, size, point.x, point.y, visited)
        })
        visited.forEach((set, x) => {
            set.forEach((y) => {
                helper.set(x, y, 0xffffffff)
            })
        })
    },
    renderReplacement: (oldAction, newAction, helper) => {
        if (newAction.points.length === oldAction.points.length + 1) {
            const prev = newAction.points[newAction.points.length - 2]
            const last = newAction.points[newAction.points.length - 1]

            const visited = new Map<number, Set<number>>()
            getPointsOnPath([prev, last], interval).forEach((point) => {
                drawShape(newAction.shape, newAction.size, point.x, point.y, visited)
            })
            visited.forEach((set, x) => {
                set.forEach((y) => {
                    helper.set(x, y, 0xffffffff)
                })
            })
            return true
        }
        return false
    }
}

export const getPointsOnPath = (path: { x: number, y: number }[], interval: number = 1): { x: number, y: number }[] => {
    const result: { x: number, y: number }[] = []
    if (interval === 1) {
        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i]
            const next = path[i + 1]

            let x = current.x
            let y = current.y
            const endX = next.x
            const endY = next.y

            const dx = Math.abs(endX - x)
            const dy = Math.abs(endY - y)
            const signX = x < endX ? 1 : -1
            const signY = y < endY ? 1 : -1
            let error = dx - dy

            while (true) {
                result.push({ x: x, y: y })

                if (x === endX && y === endY) {
                    break
                }
                const error2 = 2 * error

                if (error2 > -dy) {
                    error -= dy
                    x += signX
                }

                if (error2 < dx) {
                    error += dx
                    y += signY
                }
            }
        }
    } else {
        let leftover = 0
        for (let i = 0; i < path.length - 1; i++) {
            const current = path[i]
            const next = path[i + 1]

            const dx = next.x - current.x
            const dy = next.y - current.y
            const segmentLength = Math.sqrt(dx * dx + dy * dy)

            let distance = leftover

            while (distance + interval < segmentLength) {
                const ratio = (distance + interval) / segmentLength

                result.push({
                    x: current.x + dx * ratio,
                    y: current.y + dy * ratio
                })

                distance += interval
            }

            leftover = segmentLength - distance
        }
    }

    return result
}

const drawShape = (shape: "circle" | "square", size: number, x: number, y: number, visited: Map<number, Set<number>>) => {
    const minX = x - Math.floor(size / 2)
    const minY = y - Math.floor(size / 2)
    const maxX = x + Math.ceil(size / 2)
    const maxY = y + Math.ceil(size / 2)

    const cx = (size % 2 === 0) ? x - 0.5 : x
    const cy = (size % 2 === 0) ? y - 0.5 : y

    for (let ix = minX; ix < maxX; ix++) {
        for (let iy = minY; iy < maxY; iy++) {
            if (shape === "circle") {
                if (Math.hypot(ix - cx, iy - cy) > size / 2) {
                    continue
                }
            }
            if (!visited.has(ix)) {
                visited.set(ix, new Set())
            } else if (visited.get(ix)!.has(iy)) {
                continue
            }
            visited.get(ix)!.add(iy)
        }
    }
}