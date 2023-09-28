import {createDiveProfileGenerator} from "./index";

describe('createDiveProfileGenerator.generateFromAmbientPressureLevels', () => {
  describe('single level descent', () => {
    it.each([
      {
        options: {
          samplingRate: 1,
          descentRate: 1,
          initialAmbientPressure: 0
        },
        levels: [1],
        expectedResult: [
          { time: 0,  ambientPressure: 0  },
          { time: 60, ambientPressure: 1 }
        ]
      },
      {
        options: {
          samplingRate: 1,
          descentRate: 2,
          initialAmbientPressure: 0
        },
        levels: [1],
        expectedResult: [
          { time: 0,  ambientPressure: 0  },
          { time: 30, ambientPressure: 1 }
        ]
      },
      {
        options: {
          samplingRate: 1,
          descentRate: 1,
          initialAmbientPressure: 1
        },
        levels: [2],
        expectedResult: [
          { time: 0,  ambientPressure: 1 },
          { time: 60, ambientPressure: 2 }
        ]
      },
      {
        options: {
          samplingRate: 1,
          descentRate: 2,
          initialAmbientPressure: 1
        },
        levels: [2],
        expectedResult: [
          { time: 0,  ambientPressure: 1 },
          { time: 30, ambientPressure: 2 }
        ]
      },
      {
        options: {
          samplingRate: 1,
          descentRate: 1,
          initialAmbientPressure: 0
        },
        levels: [2],
        expectedResult: [
          { time: 0,   ambientPressure: 0 },
          { time: 60,  ambientPressure: 1 },
          { time: 120, ambientPressure: 2 }
        ]
      },
      {
        options: {
          samplingRate: 2,
          descentRate: 1,
          initialAmbientPressure: 0
        },
        levels: [2],
        expectedResult: [
          { time: 0,   ambientPressure: 0 },
          { time: 30,  ambientPressure: 0.5 },
          { time: 60,  ambientPressure: 1 },
          { time: 90,  ambientPressure: 1.5 },
          { time: 120, ambientPressure: 2 }
        ]
      }
    ])('goes from $options.initialAmbientPressure bar to $levels.0 bar at a descent rate of $options.descentRate bar/min ($options.samplingRate samples/min)', ({ options, levels, expectedResult }) => {
      const diveProfileGenerator = createDiveProfileGenerator(options)

      const result = diveProfileGenerator.generateFromAmbientPressureLevels(levels)

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('multi level descent', () => {
    it.each([
      {
        options: {
          samplingRate: 1,
          descentRate: 1,
          initialAmbientPressure: 0
        },
        levels: [1, 3],
        expectedResult: [
          { time: 0,  ambientPressure: 0  },
          { time: 60, ambientPressure: 1 },
          { time: 120, ambientPressure: 2 },
          { time: 180, ambientPressure: 3 }
        ]
      }
    ])('goes from $options.initialAmbientPressure bar to $levels.1 bar at a descent rate of $options.descentRate bar/min ($levels.length levels - $options.samplingRate samples/min)', ({ options, levels, expectedResult }) => {
      const diveProfileGenerator = createDiveProfileGenerator(options)

      const result = diveProfileGenerator.generateFromAmbientPressureLevels(levels)

      expect(result).toStrictEqual(expectedResult)
    })
  })
})