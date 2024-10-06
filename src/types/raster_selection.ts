// For simplicity, only simple rectangle selections are supported.
// Arbitrary selections like needed for Magic Wand tool
// might be quite hard to implement, especially with infinite canvas
// and there are more critical features to do first.
export type SelectionPart =
    | { height: number, type: 'rectangle', width: number, x: number, y: number }

// not `SelectionMode` to avoid collision with built-in type
export type SelectionToolMode =
    | 'replace'
