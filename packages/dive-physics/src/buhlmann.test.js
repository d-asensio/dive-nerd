import { mockDives } from '@divenerd/mock-dives'
import * as ZHL16C from './index'

describe('Golden master Bühlmann ZH-L16C', () => {
  it.each(Object.entries(mockDives))(
    '%s should match values in snapshot',
    (_, { samples }) => {
      const diveData = ZHL16C.calculateDiveProfile(samples)

      expect(diveData).toMatchSnapshot()
    }
  )
})
