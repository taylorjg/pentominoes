import * as R from 'ramda'
import * as M from './manipulations'
import { solve } from './solve'
import { drawSolution } from './svg'

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

const uniqueSolutions = []
const uniqueJoinedGrids = []

const isSolutionUnique = (rows, solution) => {
  const formattedSolution1 = formatSolution(rows, solution)
  const formattedSolution2 = M.rotateStrings(formattedSolution1)
  const formattedSolution3 = M.rotateStrings(formattedSolution2)
  const formattedSolution4 = M.rotateStrings(formattedSolution3)
  const formattedSolution5 = M.reflectStrings(formattedSolution1)
  const formattedSolution6 = M.reflectStrings(formattedSolution2)
  const formattedSolution7 = M.reflectStrings(formattedSolution3)
  const formattedSolution8 = M.reflectStrings(formattedSolution4)
  const joinedGrid1 = formattedSolution1.join('|')
  const joinedGrid2 = formattedSolution2.join('|')
  const joinedGrid3 = formattedSolution3.join('|')
  const joinedGrid4 = formattedSolution4.join('|')
  const joinedGrid5 = formattedSolution5.join('|')
  const joinedGrid6 = formattedSolution6.join('|')
  const joinedGrid7 = formattedSolution7.join('|')
  const joinedGrid8 = formattedSolution8.join('|')
  if (uniqueJoinedGrids.includes(joinedGrid1)) return false
  if (uniqueJoinedGrids.includes(joinedGrid2)) return false
  if (uniqueJoinedGrids.includes(joinedGrid3)) return false
  if (uniqueJoinedGrids.includes(joinedGrid4)) return false
  if (uniqueJoinedGrids.includes(joinedGrid5)) return false
  if (uniqueJoinedGrids.includes(joinedGrid6)) return false
  if (uniqueJoinedGrids.includes(joinedGrid7)) return false
  if (uniqueJoinedGrids.includes(joinedGrid8)) return false
  uniqueSolutions.push(solution)
  uniqueJoinedGrids.push(joinedGrid1)
  return true
}

const { solutions } = solve((rows, solution) => {
  if (isSolutionUnique(rows, solution)) {
    const formattedSolution = formatSolution(rows, solution)
    formattedSolution.forEach(line => console.log(line))
    console.log('-'.repeat(80))
    drawSolution(rows, solution)
  }
})

console.log(`solutions.length: ${solutions.length}`)
console.log(`uniqueSolutions.length: ${uniqueSolutions.length}`)
