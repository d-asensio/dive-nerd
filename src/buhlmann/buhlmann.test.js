import * as ZHL16C from './index'
import * as diveProfiles from '../dives'
import { addIndex, map, pipe } from 'ramda'

const mapIndexed = addIndex(map)

const calculateProfile = mapIndexed(ZHL16C.calculateDataPoint)

describe('Golden master Bühlmann ZH-L16C', () => {
  it.each(Object.entries(diveProfiles))(
    '%s should match values in snapshot',
    (_, { samples }) => {
      ZHL16C.resetTissues()
      const diveData = calculateProfile(samples)

      expect(diveData).toMatchSnapshot()
    }
  )
})
