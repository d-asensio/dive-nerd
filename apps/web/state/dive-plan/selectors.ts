import {DivePlan} from "@/state/dive-plan/types";

export const diveLevelIdsSelector = ({diveLevels}: DivePlan) =>
  Object.keys(diveLevels)

export const diveLevelByIdSelector = (diveLevelId: number) => ({diveLevels}: DivePlan) =>
  diveLevels[diveLevelId] || null
