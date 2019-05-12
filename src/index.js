import { solve } from './solve'
import { drawSolution } from './svg'

const { solutions } = solve((rows, solution) => drawSolution(rows, solution))
console.log(`solutions.length: ${solutions.length}`)
