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

const calculateLines = (location, coords) =>
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
        { p1: br, p2: bl },
        { p1: bl, p2: tl }
      ]
    },
    coords)

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

const GAP = 2
const HALF_GAP = GAP / 2

const toSvgPath = lines => {
  const calculatePoints = line => {
    const { p1, p2 } = line
    switch (lineDirection(line)) {
      case 'R':
        return [
          { x: p1.x + GAP, y: p1.y + HALF_GAP },
          { x: p2.x - GAP, y: p2.y + HALF_GAP }
        ]
      case 'D':
        return [
          { x: p1.x - HALF_GAP, y: p1.y + GAP },
          { x: p2.x - HALF_GAP, y: p2.y - GAP }
        ]
      case 'L':
        return [
          { x: p1.x - GAP, y: p1.y - HALF_GAP },
          { x: p2.x + GAP, y: p2.y - HALF_GAP }
        ]
      case 'U':
        return [
          { x: p1.x + HALF_GAP, y: p1.y - GAP },
          { x: p2.x + HALF_GAP, y: p2.y + GAP }
        ]
    }
  }
  const points = R.chain(calculatePoints, lines)
  const p0 = R.head(points)
  const ps = R.append(p0, R.tail(points))
  const bits = [
    `M${p0.x},${p0.y}`,
    ps.map((p, index) => {
      if (index % 2 === 0) {
        return `L${p.x},${p.y}`
      } else {
        const xAxisRotation = 0
        const largeArcFlag = 0
        const beforeLineIndex = (index - 1) / 2
        const afterLineIndex = (beforeLineIndex + 1) % lines.length
        const beforeLine = lines[beforeLineIndex]
        const afterLine = lines[afterLineIndex]
        const directions = lineDirection(beforeLine) + lineDirection(afterLine)
        const sweepFlag = ['RD', 'DL', 'LU', 'UR'].includes(directions) ? 1 : 0
        const r = sweepFlag ? HALF_GAP : GAP * 2
        return `A${r},${r},${xAxisRotation},${largeArcFlag},${sweepFlag},${p.x},${p.y}`
      }
    }).join(' '),
    `Z`
  ]
  return bits.join(' ')
}

const createPathElementForPiece = (piece, lines) => {
  const colour = labelToColour[piece.label]
  return createSvgElement('path', {
    d: toSvgPath(lines),
    fill: colour,
    'class': 'piece'
  })
}

const createPathElementForUnfilledBoundary = (size, lines) => {
  return createSvgElement('path', {
    d: toSvgPath(toSvgCoords(size)(lines)),
    'class': 'unfilled-boundary'
  })
}

export const drawSolution = (rows, solution) => {
  const boardWrapperElement = document.createElement('div')
  boardWrapperElement.setAttribute('class', 'board-wrapper')
  const svgElement = createSvgElement('svg', { 'class': 'board' })
  boardWrapperElement.appendChild(svgElement)
  const solutionsElement = document.getElementById('solutions')
  solutionsElement.appendChild(boardWrapperElement)
  const width = svgElement.getBoundingClientRect().width
  svgElement.style.height = width
  solution.forEach(rowIndex => {
    const placement = rows[rowIndex]
    const pathElement = createPathElementForPiece(
      placement.piece,
      R.pipe(
        calculateLines,
        eliminateDuplicateLines,
        orderLines,
        consolidateLines,
        toSvgCoords(width)
      )(placement.location, placement.variation.coords))
    svgElement.appendChild(pathElement)
  })
  const holeBoundary = createPathElementForUnfilledBoundary(width, [
    { p1: { x: 3, y: 3 }, p2: { x: 5, y: 3 } },
    { p1: { x: 5, y: 3 }, p2: { x: 5, y: 5 } },
    { p1: { x: 5, y: 5 }, p2: { x: 3, y: 5 } },
    { p1: { x: 3, y: 5 }, p2: { x: 3, y: 3 } }
  ])
  svgElement.appendChild(holeBoundary)
  // const outerBoundary = createPathElementForUnfilledBoundary(size, [
  //   { p1: { x: 0, y: 0 }, p2: { x: 8, y: 0 } },
  //   { p1: { x: 8, y: 0 }, p2: { x: 8, y: 8 } },
  //   { p1: { x: 8, y: 8 }, p2: { x: 0, y: 8 } },
  //   { p1: { x: 0, y: 8 }, p2: { x: 0, y: 0 } }
  // ])
  // svgElement.appendChild(outerBoundary)
}
