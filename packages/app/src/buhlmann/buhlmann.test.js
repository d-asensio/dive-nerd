import * as ZHL16C from './index'
import * as diveProfiles from '../dives'

describe('Golden master Bühlmann ZH-L16C', () => {
  it.each(Object.entries(diveProfiles))(
    '%s should match values in snapshot',
    (_, { samples }) => {
      const diveData = ZHL16C.calculateDiveProfile(samples)

      expect(diveData).toMatchSnapshot()
    }
  )
})
