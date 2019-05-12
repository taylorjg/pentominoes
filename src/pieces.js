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

const reflect = pattern =>
  pattern.map(R.reverse)

const findUniqueVariations = ({ label, pattern }) => {
  const north = {
    orientation: 'N',
    reflected: false,
    pattern
  }
  const west = {
    orientation: 'W',
    reflected: false,
    pattern: rotate90CounterClockwise(north.pattern)
  }
  const south = {
    orientation: 'S',
    reflected: false,
    pattern: rotate90CounterClockwise(west.pattern)
  }
  const east = {
    orientation: 'E',
    reflected: false,
    pattern: rotate90CounterClockwise(south.pattern)
  }
  const northReflected = {
    orientation: 'N',
    reflected: true,
    pattern: reflect(north.pattern)
  }
  const westReflected = {
    orientation: 'W',
    reflected: true,
    pattern: reflect(west.pattern)
  }
  const southReflected = {
    orientation: 'S',
    reflected: true,
    pattern: reflect(south.pattern)
  }
  const eastReflected = {
    orientation: 'E',
    reflected: true,
    pattern: reflect(east.pattern)
  }
  const allVariations = [
    north,
    south,
    east,
    west,
    northReflected,
    southReflected,
    eastReflected,
    westReflected
  ]
  const uniqueVariations = R.uniqBy(
    variation => variation.pattern.join('|'),
    allVariations)
  return {
    label,
    variations: uniqueVariations.map(({ orientation, reflected, pattern }) => ({
      orientation,
      reflected,
      coords: Array.from(patternToCoords(pattern))
    }))
  }
}

export const pieces = pieceDescriptions.map(findUniqueVariations)
