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

const drawPiece = (svgElement, placement) => {
  const colour = labelToColour[placement.piece.label]
  const location = placement.location
  placement.variation.coords.forEach(coords => {
    const x = location.x + coords.x
    const y = location.y + coords.y
    const rect = createSvgElement('rect', {
      x: `${x * 12.5}%`,
      y: `${y * 12.5}%`,
      width: '12.5%',
      height: '12.5%',
      fill: colour
    })
    svgElement.appendChild(rect)
  })
}

export const drawSolution = (rows, solution) => {
  const svgElement = createSvgElement('svg')
  svgElement.style.width = 200
  svgElement.style.height = 200
  svgElement.setAttribute('class', 'board')
  solution.forEach(rowIndex => {
    const row = rows[rowIndex]
    drawPiece(svgElement, row)
  })
  const solutionsElement = document.getElementById('solutions')
  solutionsElement.appendChild(svgElement)
}
