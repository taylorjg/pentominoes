import { solve} from './solve'

const { rows, solutions } = solve()
const firstSolution = solutions[0]
firstSolution.forEach(index => {
  const row = rows[index]
  console.log(`${row.piece.label} ${row.rotation.orientation} ${JSON.stringify(row.rotation.coords)}`)
})
