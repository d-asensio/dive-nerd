/**
 * Static catalogue of cylinders the planner offers. Each entry encodes
 * everything intrinsic to the cylinder; the user picks an entry from the
 * dropdown and the material/sizing follow — no separate "Aluminium/Steel"
 * choice, exactly the way real tech-dive shops sell them.
 */
export type TankMaterial = "aluminium" | "steel"

export interface TankModel {
  id: string                   // stable key used as Tank.modelId
  label: string                // shown in the picker & rows
  material: TankMaterial
  waterVolumeLiters: number    // internal water capacity (litres)
  workingPressureBar: number   // stamped working pressure
  emptyWeightKg?: number       // dry weight (optional, future use)
}

export const tankLibrary: TankModel[] = [
  // Aluminium stages / deco bottles
  {
    id: "AL40",
    label: "AL40 (5.7 L)",
    material: "aluminium",
    waterVolumeLiters: 5.7,
    workingPressureBar: 207,
    emptyWeightKg: 6.3,
  },
  {
    id: "AL80",
    label: "AL80 (11 L)",
    material: "aluminium",
    waterVolumeLiters: 11,
    workingPressureBar: 207,
    emptyWeightKg: 14.3,
  },
  // Single steel cylinders
  {
    id: "S10",
    label: "10 L steel",
    material: "steel",
    waterVolumeLiters: 10,
    workingPressureBar: 232,
    emptyWeightKg: 13.5,
  },
  {
    id: "S12",
    label: "12 L steel",
    material: "steel",
    waterVolumeLiters: 12,
    workingPressureBar: 232,
    emptyWeightKg: 16.0,
  },
  {
    id: "S15",
    label: "15 L steel",
    material: "steel",
    waterVolumeLiters: 15,
    workingPressureBar: 232,
    emptyWeightKg: 19.0,
  },
  // Manifolded back-mounted twinsets (modelled as a single library entry)
  {
    id: "Twin8",
    label: "Twin 8 L steel",
    material: "steel",
    waterVolumeLiters: 16, // 2 × 8 L
    workingPressureBar: 232,
    emptyWeightKg: 22,
  },
  {
    id: "Twin12",
    label: "Twin 12 L steel",
    material: "steel",
    waterVolumeLiters: 24, // 2 × 12 L
    workingPressureBar: 232,
    emptyWeightKg: 34,
  },
  {
    id: "Twin18",
    label: "Twin 18 L steel",
    material: "steel",
    waterVolumeLiters: 36, // 2 × 18 L
    workingPressureBar: 232,
    emptyWeightKg: 50,
  },
]

const modelById = new Map(tankLibrary.map(model => [model.id, model]))

export const tankModelOf = (modelId: string): TankModel | undefined =>
  modelById.get(modelId)

/** Free-gas volume at the surface (litres) for the given tank. */
export const tankFreeGasLiters = (model: TankModel, pressureBar: number): number =>
  model.waterVolumeLiters * pressureBar
