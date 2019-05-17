import * as R from 'ramda'

export const rotateStrings = strings => {
  const h = strings.length
  const w = strings[0].length
  const xs = R.range(0, w)
  const ys = R.range(0, h)
  const reversedStrings = reflectStrings(strings)
  return R.chain(x => R.join('', R.map(y => reversedStrings[y][x], ys)), xs)
}

export const reflectStrings = strings =>
  strings.map(R.reverse)
