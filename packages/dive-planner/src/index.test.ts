import {createDivePlanner, DivePlan, DiveProfileIntervalType} from "./index";

describe('divePlanner.calculateDiveProfileFromPlanV1', () => {
  it('returns an empty intervals if the plan has no levels', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: []
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([])
  })

  it('calculates the intervals of the descent and navigation for a single level dive of 25min. @ 45m', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 25,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        }
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })

  it('does not return the interval for the navigation if the descent takes more than the whole duration of the level', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 4,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        }
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })

  it('does not return the interval for the descent if it takes no time to reach the depth between intervals', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 4,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        },
        {
          duration: 25,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        },
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 29.5,
        initialDepth: 45,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })

  it('does not return the interval for the navigation if the descent takes exactly the same as duration of the level', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 4.5,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        }
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })

  it('calculates the intervals of the descent and navigation for a multi level dive of 25min@45m -> 10min@50m', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 25,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        },
        {
          duration: 10,
          depth: 50,
          gas: { fO2: .21, fHe: 0 }
        }
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 25,
        finalTime: 25.5,
        initialDepth: 45,
        finalDepth: 50,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 25.5,
        finalTime: 35,
        initialDepth: 50,
        finalDepth: 50,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })

  it('calculates the intervals of the descent, navigation ascent and navigation for a multi level dive of 25min@45m -> 15min@40m', () => {
    const divePlanner = createDivePlanner({})
    const plan: DivePlan = {
      descentRate: 10,
      ascentRate: 5,
      levels: [
        {
          duration: 25,
          depth: 45,
          gas: { fO2: .21, fHe: 0 }
        },
        {
          duration: 15,
          depth: 40,
          gas: { fO2: .21, fHe: 0 }
        }
      ]
    }

    const result = divePlanner.calculateDiveProfileFromPlanV1(plan)

    expect(result).toStrictEqual([
      {
        type: DiveProfileIntervalType.DESCENT,
        initialTime: 0,
        finalTime: 4.5,
        initialDepth: 0,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 4.5,
        finalTime: 25,
        initialDepth: 45,
        finalDepth: 45,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.ASCENT,
        initialTime: 25,
        finalTime: 26,
        initialDepth: 45,
        finalDepth: 40,
        gas: { fO2: .21, fHe: 0 }
      },
      {
        type: DiveProfileIntervalType.NAVIGATION,
        initialTime: 26,
        finalTime: 40,
        initialDepth: 40,
        finalDepth: 40,
        gas: { fO2: .21, fHe: 0 }
      }
    ])
  })
})



