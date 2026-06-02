import {
  createLevelsToSegmentsInterpolator
} from "./levels-to-segments-interpolator";
import {DiveProfileIntervalType} from "./index";
import {DivePlanLevel} from "./types";

describe('interpolate', () => {
  it('returns an empty intervals if the plan has no levels', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = []

    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([])
  })

  it('calculates the segments of the descent and navigation for a single level dive of 25min. @ 45m', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 25,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ]

    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })

  it('does not return the segment for the navigation if the descent takes more than the whole duration of the level', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 4,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ]


    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })

  it('does not return the segment for the descent if it takes no time to reach the depth between intervals', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 4,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        duration: 25,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ]


    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 29.5,
        initialDepth: 45,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })

  it('does not return the segment for the navigation if the descent takes exactly the same as duration of the level', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 4.5,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ]


    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })

  it('calculates the segments of the descent and navigation for a multi level dive of 25min@45m -> 10min@50m', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 25,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        duration: 10,
        depth: 50,
        gas: {fO2: .21, fHe: 0}
      }
    ]


    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 25,
        finalTime: 25.5,
        initialDepth: 45,
        finalDepth: 50,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 25.5,
        finalTime: 35,
        initialDepth: 50,
        finalDepth: 50,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })

  it('calculates the segments of the descent, navigation ascent and navigation for a multi level dive of 25min@45m -> 15min@40m', () => {
    const levelsToSegmentsInterpolator = createLevelsToSegmentsInterpolator()
    const options = {
      descentRate: 10,
      ascentRate: 5
    }
    const levels: DivePlanLevel[] = [
      {
        duration: 25,
        depth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        duration: 15,
        depth: 40,
        gas: {fO2: .21, fHe: 0}
      }
    ]


    const result = levelsToSegmentsInterpolator.interpolate(levels, options)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.ASCENT,
        initialTime: 25,
        finalTime: 26,
        initialDepth: 45,
        finalDepth: 40,
        gas: {fO2: .21, fHe: 0}
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 26,
        finalTime: 40,
        initialDepth: 40,
        finalDepth: 40,
        gas: {fO2: .21, fHe: 0}
      }
    ])
  })
})

describe('interpolate — CCR', () => {
  const diluent = { fO2: 0.21, fHe: 0, isDecoGas: false }
  const bottomGas = { fO2: 0.21, fHe: 0.35, isDecoGas: false }

  it('uses the diluent and tags descent with low setpoint and ascent with high setpoint', () => {
    const interpolator = createLevelsToSegmentsInterpolator()
    const segments = interpolator.interpolate(
      [
        { depth: 40, duration: 20, gas: bottomGas },
        { depth: 20, duration: 10, gas: bottomGas }
      ],
      {
        descentRate: 20,
        ascentRate: 9,
        circuit: 'CCR',
        diluent,
        setpointLow: 0.7,
        setpointHigh: 1.3
      }
    )

    const descent = segments.find(s => s.type === DiveProfileIntervalType.DESCENT)!
    const navigation = segments.find(s => s.type === DiveProfileIntervalType.NAVIGATION)!
    const ascent = segments.find(s => s.type === DiveProfileIntervalType.ASCENT)!

    expect(descent.gas).toBe(diluent)
    expect(descent.circuit).toBe('CCR')
    expect(descent.setpoint).toBe(0.7)
    expect(navigation.setpoint).toBe(0.7)
    expect(ascent.setpoint).toBe(1.3)
  })

  it('leaves segments untouched (OC, no setpoint) when circuit is omitted', () => {
    const interpolator = createLevelsToSegmentsInterpolator()
    const segments = interpolator.interpolate(
      [{ depth: 40, duration: 20, gas: bottomGas }],
      { descentRate: 20, ascentRate: 9 }
    )

    expect(segments[0].circuit).toBeUndefined()
    expect(segments[0].setpoint).toBeUndefined()
    expect(segments[0].gas).toBe(bottomGas)
  })
})
