import {DivePlan} from "@/state/dive-plan/types";
import {createSelector} from 'reselect'

export const diveLevelIdsSelector = ({diveLevelsMap}: DivePlan) =>
  Object.keys(diveLevelsMap)

export const isFirstDiveLevelSelector = createSelector([
    diveLevelIdsSelector,
    (_, diveLevelId: string) => diveLevelId
  ],
  ([firstLevelId], diveLevelId: string) =>
    diveLevelId === firstLevelId
)


export const diveLevelByIdSelector =   ({diveLevelsMap}: DivePlan, diveLevelId: string) =>
  diveLevelsMap[diveLevelId] || null
