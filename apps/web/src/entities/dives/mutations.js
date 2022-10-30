import produce from 'immer'
import { indexBy, prop, keys } from 'ramda'

const indexById = indexBy(prop('id'))

export const saveDivesMutation = produce((state, dives) => {
  const divesById = indexById(dives)
  const diveIdList = keys(divesById)

  state.divesById = divesById
  state.diveIdList = diveIdList
})
