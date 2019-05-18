import * as R from 'ramda'
import * as M from './stringManipulations'
import { drawSolution } from './svg'

// TODO: use nested reduce calls to make this functional
// see https://github.com/taylorjg/pentominoes-cs/blob/master/PentominoesLib/Pentominoes.cs#L54-L74
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

const solutionIsUnique = (rows, solution) => {
  const formattedSolution1 = formatSolution(rows, solution)
  const formattedSolution2 = M.rotateStrings(formattedSolution1)
  const formattedSolution3 = M.rotateStrings(formattedSolution2)
  const formattedSolution4 = M.rotateStrings(formattedSolution3)
  const formattedSolution5 = M.reflectStrings(formattedSolution1)
  const formattedSolution6 = M.reflectStrings(formattedSolution2)
  const formattedSolution7 = M.reflectStrings(formattedSolution3)
  const formattedSolution8 = M.reflectStrings(formattedSolution4)
  const joinedGrids = [
    formattedSolution1.join('|'),
    formattedSolution2.join('|'),
    formattedSolution3.join('|'),
    formattedSolution4.join('|'),
    formattedSolution5.join('|'),
    formattedSolution6.join('|'),
    formattedSolution7.join('|'),
    formattedSolution8.join('|')
  ]
  return R.intersection(joinedGrids, uniqueJoinedGrids).length === 0
}

const solveWorker = new Worker('./solveWorker.js', { type: 'module' })

// TODO: could use RxJS scan ?
// https://rxjs.dev/api/operators/scan
solveWorker.onmessage = e => {
  
  switch (e.data.message) {

    case 'solutionFound': {
      const { rows, solution } = e.data
      if (solutionIsUnique(rows, solution)) {
        drawSolution(rows, solution)
        const formattedSolution = formatSolution(rows, solution)
        const joinedGrid = formattedSolution.join('|')
        uniqueSolutions.push(solution)
        uniqueJoinedGrids.push(joinedGrid)
        formattedSolution.forEach(line => console.log(line))
        console.log('-'.repeat(80))
      }
      break;
    }

    case 'done': {
      const { solutions } = e.data
      console.log(`solutions.length: ${solutions.length}`)
      console.log(`uniqueSolutions.length: ${uniqueSolutions.length}`)
      break
    }
  }
}
