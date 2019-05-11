import * as R from 'ramda'
import { pieceDescriptions } from './pieceDescriptions'

function* patternToCoords(pattern) {
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

const rotate90CounterClockwise = pattern => {
  const h = pattern.length
  const w = pattern[0].length
  const xs = R.range(0, w)
  const ys = R.range(0, h)
  return R.chain(x => R.join('', R.map(y => pattern[y][w - x - 1], ys)), xs)
}

const uniqueRotations = ({ label, pattern }) => {
  const north = {
    orientation: 'N',
    pattern
  }
  const west = {
    orientation: 'W',
    pattern: rotate90CounterClockwise(north.pattern)
  }
  const south = {
    orientation: 'S',
    pattern: rotate90CounterClockwise(west.pattern)
  }
  const east = {
    orientation: 'E',
    pattern: rotate90CounterClockwise(south.pattern)
  }
  const patternOrientations = [north, east, west, south]
  const uniquePatternOrientations = R.uniqBy(
    orientation => orientation.pattern.join('|'),
    patternOrientations)
  return {
    label,
    rotations: uniquePatternOrientations.map(({ orientation, pattern }) => ({
      orientation,
      coords: Array.from(patternToCoords(pattern))
    }))
  }
}

export const pieces = pieceDescriptions.map(uniqueRotations)
