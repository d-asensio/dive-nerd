import {v1 as uuid} from "uuid"

import {TanksState} from "@/state/tanks/types"
import {bottomGasId, deco21GasId} from "@/state/dive-gases/initial"

const backTankId = uuid()
const decoTankId = uuid()

export const initialTanks: TanksState = {
  tanksMap: {
    [backTankId]: {
      modelId: "Twin12",      // twin 12 L steel back-mount
      gasId: bottomGasId,     // breathes the default bottom gas (Helitrox 21/22)
      pressure: 200,
    },
    [decoTankId]: {
      modelId: "AL80",        // aluminium stage / deco bottle
      gasId: deco21GasId,     // EAN50
      pressure: 200,
    },
  },
  tanksIdList: [backTankId, decoTankId],
}
