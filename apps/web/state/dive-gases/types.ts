import {Gas} from "@/utils/types";

export interface Gases {
  gasesMap: Record<string, Gas>,
}

export interface GasesState extends Gases {
  gasesIdList: string[]
}
