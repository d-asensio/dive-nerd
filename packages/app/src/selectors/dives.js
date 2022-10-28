
import { createCachedSelector } from 're-reselect'

export const divesByIdSelector = ({ divesById }) => divesById ?? {}

export const diveIdListSelector = ({ diveIdList }) => diveIdList ?? []

const diveIdParameter = (_, id) => id

export const diveSelector = createCachedSelector(
  divesByIdSelector,
  diveIdParameter,
  (divesById, id) => divesById[id] ?? null
)(
  diveIdParameter
)
