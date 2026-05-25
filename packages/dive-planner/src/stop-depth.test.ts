import { roundUpToStopGrid, nextShallowerStop } from './stop-depth'

describe('roundUpToStopGrid', () => {
  test.each([
    { input: 0, expected: 0 },
    { input: -2, expected: 0 },
    { input: 0.5, expected: 3 },
    { input: 3, expected: 3 },
    { input: 3.0001, expected: 6 },
    { input: 4.5, expected: 6 },
    { input: 17.2, expected: 18 },
    { input: 18, expected: 18 },
    { input: 18.5, expected: 21 }
  ])('rounds $input m up to $expected m', ({ input, expected }) => {
    expect(roundUpToStopGrid(input)).toBe(expected)
  })
})

describe('nextShallowerStop', () => {
  test.each([
    { input: 21, expected: 18 },
    { input: 6, expected: 3 },
    { input: 3, expected: 0 },
    { input: 0, expected: 0 }
  ])('steps from $input m to $expected m', ({ input, expected }) => {
    expect(nextShallowerStop(input)).toBe(expected)
  })
})
