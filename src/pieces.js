import * as R from 'ramda'
import * as M from './stringManipulations'
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

const findUniqueVariations = ({ label, pattern }) => {
  const north = {
    orientation: 'N',
    reflected: false,
    pattern
  }
  const west = {
    orientation: 'W',
    reflected: false,
    pattern: M.rotateStrings(north.pattern)
  }
  const south = {
    orientation: 'S',
    reflected: false,
    pattern: M.rotateStrings(west.pattern)
  }
  const east = {
    orientation: 'E',
    reflected: false,
    pattern: M.rotateStrings(south.pattern)
  }
  const northReflected = {
    orientation: 'N',
    reflected: true,
    pattern: M.reflectStrings(north.pattern)
  }
  const westReflected = {
    orientation: 'W',
    reflected: true,
    pattern: M.reflectStrings(west.pattern)
  }
  const southReflected = {
    orientation: 'S',
    reflected: true,
    pattern: M.reflectStrings(south.pattern)
  }
  const eastReflected = {
    orientation: 'E',
    reflected: true,
    pattern: M.reflectStrings(east.pattern)
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
