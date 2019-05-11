import * as R from 'ramda'
import { pieceDescriptions } from './pieceDescriptions'

function* listOfCoords(description) {
  const rows = description.length
  const cols = description[0].length
  for (const row of R.range(0, rows)) {
    for (const col of R.range(0, cols)) {
      if (description[row][col] === 'X') {
        yield { row, col }
      }
    }
  }
}

const descriptionToListOfCoords = description =>
  Array.from(listOfCoords(description))

export const pieces = pieceDescriptions.map(descriptionToListOfCoords)
