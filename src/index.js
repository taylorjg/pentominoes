// import * as D from 'dlxlib'
import { pieces } from './pieces'

for (const piece of pieces) {
  console.log(JSON.stringify(piece.map(({row, col}) => `(${row}, ${col})`)))
}

// describe each piece
// F I L P N T U V W X Y Z
// coords list for each piece

// function to draw a solution using SVG

// build matrix
// solve matrix
// draw each solution
