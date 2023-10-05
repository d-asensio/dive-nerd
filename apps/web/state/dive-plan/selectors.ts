import {DivePlan} from "@/state/dive-plan/types";

export const diveLevelIdsSelector = ({diveLevels}: DivePlan) =>
  Array.from(diveLevels.keys())
export const diveLevelByIdSelector = (diveLevelId: number) => ({diveLevels}: DivePlan) =>
  diveLevels[diveLevelId] || null
