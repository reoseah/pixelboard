export const doRectanglesIntersect = (
  a: { height: number, width: number, x: number, y: number },
  b: { height: number, width: number, x: number, y: number },
) => {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y
}
