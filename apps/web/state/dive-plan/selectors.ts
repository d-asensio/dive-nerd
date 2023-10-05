import {DivePlan} from "@/state/dive-plan/types";

export const isFirstDiveLevelSelector = ({diveLevels}: DivePlan, diveLevelId: string) =>
  Object.keys(diveLevels)[0] === diveLevelId

export const diveLevelByIdSelector =   ({diveLevels}: DivePlan, diveLevelId: string) =>
  diveLevels[diveLevelId] || null
