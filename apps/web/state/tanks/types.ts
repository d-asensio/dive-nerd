/**
 * One cylinder the diver is carrying. Decoupled from the dive-plan slice — for
 * now tanks are informational (carried gas, pressure, total free-gas volume);
 * the algorithm still reads breathing gas from the level → gas mapping.
 */
export interface Tank {
  modelId: string   // refers to a preset in the tank library (AL40, AL80, Twin12, …)
  gasId: string     // refers to a gas in the gases slice
  pressure: number  // bar
}

export interface Tanks {
  tanksMap: Record<string, Tank>
}

export interface TanksState extends Tanks {
  tanksIdList: string[]
}
