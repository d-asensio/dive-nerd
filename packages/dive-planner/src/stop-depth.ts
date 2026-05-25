/**
 * Quantises ceiling depths to the operational 3 m deco-stop grid.
 *
 * The convention (Baker, MultiDeco) is to round the ceiling **up** to the
 * next 3 m multiple, so the actual stop is always at or below the
 * mathematical ceiling.
 */
const STOP_GRID_METERS = 3

const isOnGrid = (depth: number): boolean => depth % STOP_GRID_METERS === 0

export const roundUpToStopGrid = (ceilingDepth: number): number => {
  if (ceilingDepth <= 0) return 0
  if (isOnGrid(ceilingDepth)) return ceilingDepth

  return Math.ceil(ceilingDepth / STOP_GRID_METERS) * STOP_GRID_METERS
}

export const nextShallowerStop = (currentStopDepth: number): number =>
  Math.max(0, currentStopDepth - STOP_GRID_METERS)
