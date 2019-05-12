import { solve } from './solve'
import { drawSolution } from './svg'

const { rows, solutions } = solve()
console.log(`solutions.length: ${solutions.length}`)
solutions.forEach(solution => drawSolution(rows, solution))
