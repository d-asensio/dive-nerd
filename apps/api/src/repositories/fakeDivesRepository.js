import { mockDives } from '@divenerd/mock-dives'
import { faker } from '@faker-js/faker'
import * as ZHL16C from '@divenerd/dive-physics'

const adaptData = ({ time, gasMixtures, compartments, ...sample }) => {
  const { depth } = sample

  const timeInMinutes = time / 60

  return {
    ...sample,
    time: timeInMinutes,
    gasMixture: gasMixtures,
    compartmentsGasLoad: compartments,
    cartesianCoordinates: {
      x: timeInMinutes,
      y: depth
    }
  }
}

export const createFakeDivesRepository = () => {
  const getAllDives = () => Object.values(mockDives).map(({ samples }) => {
    const diveProfile = ZHL16C.calculateDiveProfile(samples)

    return {
      id: faker.datatype.uuid(),
      name: faker.animal.fish(),
      date: faker.date.recent(),
      rating: faker.datatype.number({ min: 0, max: 5, precision: 1 }),
      coordinates: {
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude())
      },
      profile: {
        maximunDepth: parseFloat(faker.datatype.number({ min: 10, max: 70, precision: 0.01 })),
        totalDuration: parseFloat(faker.datatype.number({ min: 10, max: 55, precision: 0.01 })),
        dataPoints: diveProfile.map(adaptData)
      }
    }
  })

  return { getAllDives }
}
