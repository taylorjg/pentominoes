import * as R from 'ramda'

const labelToColour = {
  F: '#CCCCE5',
  I: '#650205',
  L: '#984D11',
  P: '#FD8023',
  N: '#FFFD38',
  T: '#FC2028',
  U: '#7F1CC9',
  V: '#6783E3',
  W: '#0F7F12',
  X: '#FC1681',
  Y: '#29FD2F',
  Z: '#CCCA2A'
}

const createSvgElement = (elementName, additionalAttributes = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', elementName)
  Object.entries(additionalAttributes).forEach(([name, value]) =>
    element.setAttribute(name, value))
  return element
}

const samePoint = (p1, p2) =>
  p1.x === p2.x && p1.y === p2.y

const sameLine = (l1, l2) =>
  (samePoint(l1.p1, l2.p1) && samePoint(l1.p2, l2.p2)) ||
  (samePoint(l1.p1, l2.p2) && samePoint(l1.p2, l2.p1))

const reverseLine = line => ({
  p1: {
    x: line.p2.x,
    y: line.p2.y
  },
  p2: {
    x: line.p1.x,
    y: line.p1.y
  }
})

const lineDirection = ({ p1, p2 }) => {
  if (p1.x === p2.x) return p1.y < p2.y ? 'D' : 'U'
  if (p1.y === p2.y) return p1.x < p2.x ? 'R' : 'L'
}

const calculateLines = (location, variation) =>
  R.chain(
    coords => {
      const x = location.x + coords.x
      const y = location.y + coords.y
      const tl = { x, y }
      const tr = { x: x + 1, y }
      const br = { x: x + 1, y: y + 1 }
      const bl = { x, y: y + 1 }
      return [
        { p1: tl, p2: tr },
        { p1: tr, p2: br },
        { p1: bl, p2: br },
        { p1: tl, p2: bl }
      ]
    },
    variation.coords)

const eliminateDuplicateLines = lines => {
  const countOccurrencesOfLine = line1 => lines.filter(line2 => sameLine(line1, line2)).length
  return lines.filter(line => countOccurrencesOfLine(line) === 1)
}

// TODO: use recursion to make this functional
const orderLines = lines => {
  let currentLine = lines[0]
  let otherPoint = currentLine.p2
  const startingPoint = currentLine.p1
  const results = [currentLine]
  for (; ;) {
    if (samePoint(otherPoint, startingPoint)) break
    currentLine = lines
      .filter(line1 => !results.find(line2 => sameLine(line1, line2)))
      .find(line => samePoint(line.p1, otherPoint) || samePoint(line.p2, otherPoint))
    const p1Matched = samePoint(currentLine.p1, otherPoint)
    otherPoint = p1Matched ? currentLine.p2 : currentLine.p1
    results.push(p1Matched ? currentLine : reverseLine(currentLine))
  }
  return results
}

const consolidateLines = lines => {
  const result = []
  const furthestLineIndexMaintainingDirection = (originalDirection, fromLineIndex) => {
    for (let lineIndex = fromLineIndex + 1; lineIndex < lines.length; lineIndex++) {
      const nextLine = lines[lineIndex]
      const nextDirection = lineDirection(nextLine)
      if (nextDirection !== originalDirection) {
        return lineIndex
      }
    }
    return 0
  }
  for (let lineIndex = 0; lineIndex < lines.length;) {
    const line = lines[lineIndex]
    const p1 = line.p1
    lineIndex = furthestLineIndexMaintainingDirection(lineDirection(line), lineIndex)
    const p2 = lines[lineIndex].p1
    result.push({ p1, p2 })
    if (lineIndex === 0) break
  }
  return result
}

const toSvgCoords = size => lines =>
  lines.map(line => ({
    p1: {
      x: line.p1.x * size / 8,
      y: line.p1.y * size / 8
    },
    p2: {
      x: line.p2.x * size / 8,
      y: line.p2.y * size / 8
    }
  }))

// Later, for rounded corners:
// - bring in ends of lines slightly
// - introduce an ARC between each pair of lines
// - https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
// - x-axis-rotation: 0
// - large-arc-flag: 0
// - sweep-flag: 0 or 1 depending on direction
const toSvgPath = lines => {
  const points = lines.map(line => line.p1)
  const p0 = R.head(points)
  const ps = R.tail(points)
  return `
    M${p0.x},${p0.y}
    ${ps.map(p => `L${p.x},${p.y}`).join(' ')}
    Z
  `
}

const createPathElementForPiece = (piece, lines) => {
  const colour = labelToColour[piece.label]
  return createSvgElement('path', {
    d: toSvgPath(lines),
    fill: colour,
    'class': 'piece'
  })
}

export const drawSolution = (rows, solution) => {
  const size = 400
  const boardWrapperElement = document.createElement('div')
  boardWrapperElement.setAttribute('class', 'board-wrapper')
  const svgElement = createSvgElement('svg', {
    // 'width': '50%'
    'width': size,
    'height': size
  })
  boardWrapperElement.appendChild(svgElement)
  const solutionsElement = document.getElementById('solutions')
  solutionsElement.appendChild(boardWrapperElement)
  svgElement.style.height = svgElement.getBoundingClientRect().width
  solution.forEach(rowIndex => {
    const placement = rows[rowIndex]
    const pathElement = createPathElementForPiece(
      placement.piece,
      R.pipe(
        calculateLines,
        eliminateDuplicateLines,
        orderLines,
        consolidateLines,
        toSvgCoords(size)
      )(placement.location, placement.variation))
    svgElement.appendChild(pathElement)
  })
}
