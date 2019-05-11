import * as R from 'ramda'
import { pieceDescriptions } from './pieceDescriptions'

function* listOfCoords(pattern) {
  const rows = pattern.length
  const cols = pattern[0].length
  for (const row of R.range(0, rows)) {
    for (const col of R.range(0, cols)) {
      if (pattern[row][col] === 'X') {
        yield { x: col, y: row }
      }
    }
  }
}

const descriptionToPiece = ({ label, pattern }) => ({
  label,
  coords: Array.from(listOfCoords(pattern))
})

export const pieces = pieceDescriptions.map(descriptionToPiece)
