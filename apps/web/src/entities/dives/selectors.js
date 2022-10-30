
import { createCachedSelector } from 're-reselect'

const diveIdParameter = (_, id) => id

export const divesByIdSelector = ({ divesById }) => divesById ?? {}

export const diveIdListSelector = ({ diveIdList }) => diveIdList ?? []

export const diveSelector = createCachedSelector(
  divesByIdSelector,
  diveIdParameter,
  (divesById, id) => divesById[id] ?? null
)(
  diveIdParameter
)
