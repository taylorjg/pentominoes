const F = [
  ' XX',
  'XX ',
  ' X '
]

const I = [
  'X',
  'X',
  'X',
  'X',
  'X'
]

const L = [
  'X ',
  'X ',
  'X ',
  'XX'
]

const P = [
  'XX',
  'XX',
  'X '
]

const N = [
  ' X',
  'XX',
  'X ',
  'X '
]

const T = [
  'XXX',
  ' X ',
  ' X '
]

const U = [
  'X X',
  'XXX'
]

const V = [
  'X  ',
  'X  ',
  'XXX'
]

const W = [
  'X  ',
  'XX ',
  ' XX'
]

const X = [
  ' X ',
  'XXX',
  ' X '
]

const Y = [
  ' X',
  'XX',
  ' X',
  ' X'
]

const Z = [
  'XX ',
  ' X ',
  ' XX'
]

export const pieceDescriptions =
  Object.entries({ F, I, L, P, N, T, U, V, W, X, Y, Z })
    .map(([label, pattern]) => ({ label, pattern }))

