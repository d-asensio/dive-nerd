import {calculatesIntervalsFromPlan, DivePlan, DiveProfileIntervalType} from "./index";


/**
 * TODO:
 *  - Simplify consecutive intervals
 */

describe('calculatesIntervalsFromPlan', () => {
  it('returns an empty intervals if the plan has no levels', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: []
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([])
  })

  it('calculates the intervals of the descent and navigation for a single level dive of 25min. @ 45m', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 25,
          depth: 45
        }
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 4.5,
        endTime: 25,
        startDepth: 45,
        endDepth: 45
      }
    ])
  })

  it('does not return the interval for the navigation if the descent takes more than the whole duration of the level', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 4,
          depth: 45
        }
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      }
    ])
  })

  it('does not return the interval for the descent if it takes no time to reach the depth between intervals', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 4,
          depth: 45
        },
        {
          duration: 25,
          depth: 45
        },
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 4.5,
        endTime: 29.5,
        startDepth: 45,
        endDepth: 45
      }
    ])
  })

  it('does not return the interval for the navigation if the descent takes exactly the same as duration of the level', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 4.5,
          depth: 45
        }
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      }
    ])
  })

  it('calculates the intervals of the descent and navigation for a multi level dive of 25min@45m -> 10min@50m', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 25,
          depth: 45
        },
        {
          duration: 10,
          depth: 50
        }
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 4.5,
        endTime: 25,
        startDepth: 45,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 25,
        endTime: 25.5,
        startDepth: 45,
        endDepth: 50
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 25.5,
        endTime: 35,
        startDepth: 50,
        endDepth: 50
      }
    ])
  })

  it('calculates the intervals of the descent, navigation ascent and navigation for a multi level dive of 25min@45m -> 15min@40m', () => {
    const plan: DivePlan = {
      configuration: {
        descentRate: 10,
        ascentRate: 5
      },
      levels: [
        {
          duration: 25,
          depth: 45
        },
        {
          duration: 15,
          depth: 40
        }
      ]
    }

    const result = calculatesIntervalsFromPlan(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        startTime: 0,
        endTime: 4.5,
        startDepth: 0,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 4.5,
        endTime: 25,
        startDepth: 45,
        endDepth: 45
      },
      {
        type: DiveProfileIntervalType.ASCENT,
        startTime: 25,
        endTime: 26,
        startDepth: 45,
        endDepth: 40
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        startTime: 26,
        endTime: 40,
        startDepth: 40,
        endDepth: 40
      }
    ])
  })
})
