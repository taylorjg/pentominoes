import * as dlxlib from 'dlxlib'
import * as R from 'ramda'
import { pieces } from './pieces'

const placementIsValid = placement => {
  for (const coords of placement.rotation.coords) {
    const x = location.x + coords.x
    const y = location.y + coords.y
    if (x >= 8 || y >= 8) return false
    if ((x === 3 || x === 4) && (y === 3 || y === 4)) return false
  }
  return true
}

function* genLocations() {
  const xs = R.range(0, 8)
  const ys = R.range(0, 8)
  for (const x of xs) {
    for (const y of ys) {
      yield { x, y }
    }
  }
}

function* genPlacements() {
  const locations = Array.from(genLocations())
  for (const piece of pieces) {
    for (const rotation of piece.rotations) {
      for (const location of locations) {
        yield {
          piece,
          rotation,
          location
        }
      }
    }
  }
}

const buildRows = () => {
  const placements = Array.from(genPlacements())
  return placements.filter(placementIsValid)
}

const makePieceColumns = row => {
  const pieceIndex = pieces.findIndex(piece => piece === row.piece)
  return R.range(0, pieces.length)
    .map((_, index) => index === pieceIndex ? 1 : 0)
}

const makeLocationColumns = row => {
  const locationIndices = row.rotation.coords.map(({ x, y }) =>
    (row.location.y + y) * 8 + row.location.x + x)
  const cols = R.range(0, 64)
    .map((_, index) => locationIndices.includes(index) ? 1 : 0)
  const excludeIndices = [27, 28, 35, 36]
  return cols.filter((_, index) => !excludeIndices.includes(index))
}

const buildMatrix = rows =>
  rows.map(row => {
    const pieceColumns = makePieceColumns(row)
    const locationColumns = makeLocationColumns(row)
    return R.concat(pieceColumns, locationColumns)
  })

const dumpSolution = rows => solution => {
  solution.forEach(rowIndex => {
    const row = rows[rowIndex]
    const label = `label: ${row.piece.label}`
    const location = `location: ${JSON.stringify(row.location)}`
    const orientation = `orientation: ${row.rotation.orientation}`
    const coords = `coords: ${JSON.stringify(row.rotation.coords)}`
    console.log([label, location, orientation, coords].join('; '))
  })
  console.log('-'.repeat(80))
}

export const solve = solutionCount => {
  const rows = buildRows()
  const matrix = buildMatrix(rows)
  console.log(`matrix.length: ${matrix.length}`)
  const solutions = dlxlib.solve(matrix, undefined, dumpSolution(rows), solutionCount)
  return { rows, solutions }
}
