import { pieces } from './pieces'

const formatCoords = ({ x, y }) => `(${x}, ${y})`

for (const { label, coords } of pieces) {
  console.log(`label: ${label}; coords: ${JSON.stringify(coords.map(formatCoords))}`)
}

// function to draw a solution using SVG

// build matrix
// solve matrix
// draw each solution
