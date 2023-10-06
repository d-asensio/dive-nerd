import {GasMix} from "@/utils/types";

export interface Gases {
  mixesMap: Record<string, GasMix>,
}

export interface GasesState extends Gases {
  mixesIdList: string[]
}
