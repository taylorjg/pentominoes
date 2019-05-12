import * as dlxlib from 'dlxlib'
import * as R from 'ramda'
import { pieces } from './pieces'

const placementIsValid = placement => {
  const location = placement.location
  for (const coords of placement.variation.coords) {
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
    for (const variation of piece.variations) {
      for (const location of locations) {
        yield {
          piece,
          variation,
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

const makePieceColumns = placement => {
  const pieceIndex = pieces.findIndex(piece => piece === placement.piece)
  return R.range(0, pieces.length)
    .map((_, index) => index === pieceIndex ? 1 : 0)
}

const makeLocationColumns = placement => {
  const location = placement.location
  const locationIndices = placement.variation.coords.map(coords => {
    const x = location.x + coords.x
    const y = location.y + coords.y
    return y * 8 + x
  })
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

const formatSolution = (rows, solution) => {
  const cells = R.range(0, 8).map(() => Array(8))
  cells[3][3] = ' '
  cells[3][4] = ' '
  cells[4][3] = ' '
  cells[4][4] = ' '
  solution.forEach(rowIndex => {
    const placement = rows[rowIndex]
    const location = placement.location
    for (const coords of placement.variation.coords) {
      const x = location.x + coords.x
      const y = location.y + coords.y
      cells[y][x] = placement.piece.label
    }
  })
  return cells.map(row => row.join(''))
}

const dumpSolution = (rows, solution) => {
  // solution.forEach(rowIndex => {
  //   const row = rows[rowIndex]
  //   const label = `label: ${row.piece.label}`
  //   const location = `location: ${JSON.stringify(row.location)}`
  //   const orientation = `orientation: ${row.variation.orientation}`
  //   const reflected = `reflected: ${row.variation.reflected}`
  //   const coords = `coords: ${JSON.stringify(row.variation.coords)}`
  //   console.log([label, location, orientation, reflected, coords].join('; '))
  // })
  // console.log('-'.repeat(80))
  const formattedSolution = formatSolution(rows, solution)
  formattedSolution.forEach(line => console.log(line))
  console.log('-'.repeat(80))
}

export const solve = onSolutionFound => {
  const rows = buildRows()
  const matrix = buildMatrix(rows)
  console.log(`matrix.length: ${matrix.length}`)
  const solutions = dlxlib.solve(
    matrix,
    undefined,
    solution => {
      dumpSolution(rows, solution)
      onSolutionFound(rows, solution)
    })
  return { rows, solutions }
}
