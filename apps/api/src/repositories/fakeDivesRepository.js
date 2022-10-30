import { mockDives } from '@divenerd/mock-dives'
import { faker } from '@faker-js/faker'
import * as ZHL16C from '@divenerd/dive-physics'

const adaptData = (dataPoint) => {
  const { time, depth } = dataPoint

  return {
    ...dataPoint,
    x: time,
    y: depth
  }
}

export const createFakeDivesRepository = () => {
  const getAllDives = () => Object.entries(mockDives).map(([id, { samples, ...rest }]) => {
    const diveProfile = ZHL16C.calculateDiveProfile(samples)

    return {
      ...rest,
      id,
      name: faker.animal.fish(),
      rating: faker.datatype.number({ min: 0, max: 5, precision: 1 }),
      coordinates: {
        latitude: parseFloat(faker.address.latitude()),
        longitude: parseFloat(faker.address.longitude())
      },
      profile: {
        maximumDepth: parseFloat(faker.datatype.number({ min: 10, max: 70, precision: 0.01 })),
        totalDuration: parseFloat(faker.datatype.number({ min: 10, max: 55, precision: 0.01 })),
        dataPoints: diveProfile.map(adaptData)
      }
    }
  })

  return { getAllDives }
}
