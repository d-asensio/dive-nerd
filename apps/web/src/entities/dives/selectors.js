
import { createSelector } from 'reselect'
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

const highlightedDiveIdSelector = ({ highlightedDiveId }) => highlightedDiveId ?? null

export const isDiveHighlightedSelector = createSelector(
  highlightedDiveIdSelector,
  diveIdParameter,
  (highlightedDiveId, id) => highlightedDiveId === id
)
