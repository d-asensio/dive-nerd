# CCR Decompression Planning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add closed-circuit-rebreather (CCR) decompression planning alongside open-circuit (OC), selectable per plan, including a separate OC bailout schedule.

**Architecture:** A new pure "breathing source" strategy in `dive-physics` computes inspired inert-gas partial pressures and change-rate factors for OC vs CCR. The `dive-planner` integrator and the web chart util both call it. The deco algorithm gains a seedable-state entry path so a CCR plan can produce both the loop schedule and an OC bailout schedule from the end of bottom time.

**Tech Stack:** TypeScript, pnpm workspaces + Turbo, Jest + @swc/jest, Next.js/React, Zustand (immer), Ramda.

**Cross-package note:** `dive-planner` and `apps/web` consume `dive-physics` from its built `dist/` (it is a `workspace:*` dependency resolved via `main`). **After any change to `dive-physics`, rebuild it** with `pnpm --filter dive-physics build` before running `dive-planner` / web tests that rely on the new exports. This is baked into the steps below.

**Spec:** `docs/superpowers/specs/2026-06-02-ccr-decompression-design.md`

**Conventions:** This repo omits the `Co-Authored-By: Claude` trailer on commits. Use `it`/`describe`, named exports, one responsibility per file, the `({ named }) =>` object-argument style used across `dive-physics`.

---

## Task 1: Breathing-source strategy (dive-physics)

**Files:**
- Create: `packages/dive-physics/src/breathing-source.ts`
- Create: `packages/dive-physics/src/breathing-source.test.ts`
- Modify: `packages/dive-physics/src/index.ts` (add re-exports)

- [ ] **Step 1: Write the failing test**

Create `packages/dive-physics/src/breathing-source.test.ts`:

```ts
import { inspiredInertGas } from './breathing-source'

// Trimix 18/45 — fO2 0.18, fHe 0.45, fN2 0.37
const trimix = { fO2: 0.18, fHe: 0.45 }
const air = { fO2: 0.21, fHe: 0 }
const Pwv = 0.0567

describe('inspiredInertGas — open circuit', () => {
  it('matches (Pa - Pwv) * Fig for nitrogen and helium', () => {
    const result = inspiredInertGas({
      circuit: 'OC',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix
    })

    expect(result.nitrogen).toBeCloseTo((4 - Pwv) * 0.37, 6)
    expect(result.helium).toBeCloseTo((4 - Pwv) * 0.45, 6)
  })

  it('exposes the gas fractions as change-rate factors', () => {
    const result = inspiredInertGas({
      circuit: 'OC',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix
    })

    expect(result.nitrogenChangeRateFactor).toBeCloseTo(0.37, 6)
    expect(result.heliumChangeRateFactor).toBeCloseTo(0.45, 6)
    expect(result.setpointUnsustainable).toBe(false)
  })
})

describe('inspiredInertGas — closed circuit', () => {
  it('reduces to (Pa - setpoint - Pwv) for an air diluent (factor = 1)', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: air,
      setpoint: 1.3
    })

    expect(result.nitrogen).toBeCloseTo(4 - 1.3 - Pwv, 6)
    expect(result.helium).toBeCloseTo(0, 6)
    expect(result.nitrogenChangeRateFactor).toBeCloseTo(1, 6)
  })

  it('splits the inert pressure by the diluent inert ratio for trimix', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 4,
      waterVaporPressure: Pwv,
      gas: trimix,
      setpoint: 1.3
    })

    const base = 4 - 1.3 - Pwv
    const denom = 1 - 0.18 // 0.82
    expect(result.nitrogenChangeRateFactor).toBeCloseTo(0.37 / denom, 6)
    expect(result.heliumChangeRateFactor).toBeCloseTo(0.45 / denom, 6)
    expect(result.nitrogen).toBeCloseTo((0.37 / denom) * base, 6)
    expect(result.helium).toBeCloseTo((0.45 / denom) * base, 6)
  })

  it('clamps inert pressure to zero and flags when ambient cannot hold the setpoint', () => {
    const result = inspiredInertGas({
      circuit: 'CCR',
      ambientPressure: 1.2,
      waterVaporPressure: Pwv,
      gas: air,
      setpoint: 1.3
    })

    expect(result.nitrogen).toBe(0)
    expect(result.helium).toBe(0)
    expect(result.setpointUnsustainable).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter dive-physics exec jest src/breathing-source.test.ts`
Expected: FAIL — `Cannot find module './breathing-source'`.

- [ ] **Step 3: Write minimal implementation**

Create `packages/dive-physics/src/breathing-source.ts`:

```ts
/**
 * Computes the inspired (alveolar) inert-gas partial pressures driving the
 * Schreiner equation, for either an open circuit (fixed gas mix) or a closed
 * circuit rebreather (constant pO₂ setpoint, with the rest of the loop made up
 * of diluent).
 *
 * The Schreiner integration itself is identical for both circuits — only the
 * inspired inert-gas pressure and its rate of change with ambient pressure
 * differ. This module is the single source of truth for that difference.
 *
 *   OC : inert pp        = (Pa − Pwv) · F_ig
 *        change-rate factor = F_ig
 *   CCR: inert pp        = [f_i / (1 − fO2)] · (Pa − setpoint − Pwv)
 *        change-rate factor = f_i / (1 − fO2)
 *
 * where `f_i` is the inert gas fraction of the **diluent** and `fO2` its oxygen
 * fraction. The factor `f_i/(1−fO2)` is the inert gas's share of the diluent's
 * non-oxygen part; for an air diluent it is 1, so the CCR inert pressure
 * reduces to `Pa − setpoint − Pwv`.
 *
 * The CCR model is only physical while the loop can sustain the setpoint
 * (`Pa > setpoint + Pwv`). Shallower than that the inert pressure clamps to 0
 * and `setpointUnsustainable` is set so callers can warn.
 *
 * All pressures in bar. See `docs/superpowers/specs/2026-06-02-ccr-decompression-design.md`.
 */
export type Circuit = 'OC' | 'CCR'

interface InspiredInertGas {
  nitrogen: number
  helium: number
  nitrogenChangeRateFactor: number
  heliumChangeRateFactor: number
  setpointUnsustainable: boolean
}

export const inspiredInertGas = ({
  circuit,
  ambientPressure: Pa,
  waterVaporPressure: Pwv,
  gas,
  setpoint
}: {
  circuit: Circuit
  ambientPressure: number
  waterVaporPressure: number
  gas: { fO2: number; fHe: number }
  setpoint?: number
}): InspiredInertGas => {
  const nitrogenFractionOfGas = 1 - gas.fO2 - gas.fHe
  const heliumFractionOfGas = gas.fHe

  if (circuit === 'OC') {
    const inspired = Pa - Pwv
    return {
      nitrogen: inspired * nitrogenFractionOfGas,
      helium: inspired * heliumFractionOfGas,
      nitrogenChangeRateFactor: nitrogenFractionOfGas,
      heliumChangeRateFactor: heliumFractionOfGas,
      setpointUnsustainable: false
    }
  }

  const sp = setpoint ?? 0
  const nonOxygenFraction = 1 - gas.fO2
  const nitrogenFactor = nonOxygenFraction > 0 ? nitrogenFractionOfGas / nonOxygenFraction : 0
  const heliumFactor = nonOxygenFraction > 0 ? heliumFractionOfGas / nonOxygenFraction : 0

  const inertSupplyPressure = Pa - sp - Pwv
  const setpointUnsustainable = inertSupplyPressure <= 0
  const base = setpointUnsustainable ? 0 : inertSupplyPressure

  return {
    nitrogen: nitrogenFactor * base,
    helium: heliumFactor * base,
    nitrogenChangeRateFactor: nitrogenFactor,
    heliumChangeRateFactor: heliumFactor,
    setpointUnsustainable
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter dive-physics exec jest src/breathing-source.test.ts`
Expected: PASS (4 tests across both describe blocks).

- [ ] **Step 5: Re-export from the package entry**

In `packages/dive-physics/src/index.ts`, add after the existing `export` lines at the top (around line 9):

```ts
export { inspiredInertGas } from './breathing-source'
export type { Circuit } from './breathing-source'
```

- [ ] **Step 6: Rebuild dive-physics so downstream packages see the new export**

Run: `pnpm --filter dive-physics build`
Expected: tsup emits `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` with no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/dive-physics/src/breathing-source.ts packages/dive-physics/src/breathing-source.test.ts packages/dive-physics/src/index.ts
git commit -m "feat(dive-physics): add OC/CCR breathing-source strategy"
```

---

## Task 2: Thread circuit + setpoint through planner types

**Files:**
- Modify: `packages/dive-planner/src/types.ts`

- [ ] **Step 1: Add the circuit/setpoint fields to the planner types**

In `packages/dive-planner/src/types.ts`, add a new options interface and extend `DivePlan` and `DiveSegment`.

Add this interface after `DivePlanAlgorithmOptions` (after line 42):

```ts
export interface DivePlanCircuitOptions {
  /** `'OC'` (default) for open circuit, `'CCR'` for a constant-setpoint rebreather. */
  circuit: 'OC' | 'CCR'
  /** Diluent gas used on the loop in CCR mode. Ignored for OC. */
  diluent: Gas
  /** pO₂ setpoint (bar) held on descent + bottom in CCR mode. */
  setpointLow: number
  /** pO₂ setpoint (bar) held on ascent + deco in CCR mode. */
  setpointHigh: number
}
```

Change the `DivePlanOptions` union (lines 50-53) to include the new options:

```ts
export type DivePlanOptions =
  DivePlanSpeedOptions
  & Partial<DivePlanAlgorithmOptions>
  & Partial<DivePlanEnvironmentOptions>
  & Partial<DivePlanCircuitOptions>
```

Add the optional per-segment circuit/setpoint to `DiveSegment` (inside the interface, after the `gas: Gas` field at line 95):

```ts
  /** Circuit in force for this segment. Defaults to `'OC'` when absent. */
  circuit?: 'OC' | 'CCR'
  /** pO₂ setpoint (bar) for this segment. Only meaningful when `circuit === 'CCR'`. */
  setpoint?: number
```

Add `bailout` to `DiveProfile` (after line 87, inside the interface):

```ts
export interface DiveProfile {
  intervals: DiveSegment[]
  /**
   * For CCR plans, the open-circuit bailout schedule computed from the end of
   * bottom time. Absent for OC plans.
   */
  bailout?: DiveProfile
}
```

- [ ] **Step 2: Verify the package still type-checks / tests pass**

Run: `pnpm --filter dive-planner exec jest`
Expected: PASS — all existing planner tests still green (the new fields are optional, so nothing breaks).

- [ ] **Step 3: Commit**

```bash
git add packages/dive-planner/src/types.ts
git commit -m "feat(dive-planner): add circuit/setpoint fields to plan and segment types"
```

---

## Task 3: Integrator uses the breathing-source strategy

**Files:**
- Modify: `packages/dive-planner/src/compartment-integrator.ts`
- Modify: `packages/dive-planner/src/compartment-integrator.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `packages/dive-planner/src/compartment-integrator.test.ts` (append a new `describe`):

```ts
import { createCompartmentIntegrator } from './compartment-integrator'

describe('compartment integrator — CCR', () => {
  const environment = {
    surfaceAmbientPressure: 1.0133,
    waterDensity: 1023.6,
    waterVaporPressure: 0.0567
  }
  const air = { fO2: 0.21, fHe: 0, isDecoGas: false }

  it('loads less nitrogen on a CCR segment than the equivalent OC segment', () => {
    const integrator = createCompartmentIntegrator(environment)
    const start = integrator.initialCompartmentLoads()

    const ocLoads = integrator.advance({
      compartmentLoads: start,
      segment: { initialDepth: 40, finalDepth: 40, duration: 20, gas: air, circuit: 'OC' }
    })
    const ccrLoads = integrator.advance({
      compartmentLoads: start,
      segment: { initialDepth: 40, finalDepth: 40, duration: 20, gas: air, circuit: 'CCR', setpoint: 1.3 }
    })

    // On a held 1.3 setpoint the inspired N2 is lower than breathing air OC at
    // the same depth, so every compartment on-gasses less.
    expect(ccrLoads[0].nitrogenPartialPressure).toBeLessThan(ocLoads[0].nitrogenPartialPressure)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter dive-planner exec jest src/compartment-integrator.test.ts`
Expected: FAIL — `circuit`/`setpoint` not accepted, and CCR path not implemented (loads equal).

- [ ] **Step 3: Rewrite the integrator to call `inspiredInertGas`**

In `packages/dive-planner/src/compartment-integrator.ts`:

Replace the imports block (lines 14-23) with:

```ts
import {
  buhlmannCompartments,
  Circuit,
  fromDepthToHydrostaticPressure,
  inertGasTimeConstant,
  inspiredInertGas,
  schreinerEquation
} from 'dive-physics'

import { Gas } from './types'
```

Replace the `SegmentToIntegrate` interface (lines 36-41) with:

```ts
interface SegmentToIntegrate {
  initialDepth: number // m
  finalDepth: number // m
  duration: number // min
  gas: Gas
  circuit?: Circuit
  setpoint?: number
}
```

Delete the now-unused `inertGasFractionOf` helper (lines 43-46).

Replace the body of `advance` (lines 82-139) with:

```ts
  const advance = ({
    compartmentLoads,
    segment
  }: {
    compartmentLoads: CompartmentInertLoad[]
    segment: SegmentToIntegrate
  }): CompartmentInertLoad[] => {
    const { initialDepth, finalDepth, duration, gas, circuit = 'OC', setpoint } = segment
    const initialAmbientPressure = ambientPressureAt(initialDepth, environment)

    const inspired = inspiredInertGas({
      circuit,
      ambientPressure: initialAmbientPressure,
      waterVaporPressure: environment.waterVaporPressure,
      gas,
      setpoint
    })

    const pressureChangeRate = ambientPressureChangeRate({
      initialDepth,
      finalDepth,
      duration,
      environment
    })
    const nitrogenChangeRate = pressureChangeRate * inspired.nitrogenChangeRateFactor
    const heliumChangeRate = pressureChangeRate * inspired.heliumChangeRateFactor

    return compartmentLoads.map((load, index) => ({
      nitrogenPartialPressure: schreinerEquation({
        initialAlveolarGasPartialPressure: inspired.nitrogen,
        initialCompartmentGasPartialPressure: load.nitrogenPartialPressure,
        gasChangeRate: nitrogenChangeRate,
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[index].N2.halfTime
        }),
        intervalTime: duration
      }),
      heliumPartialPressure: schreinerEquation({
        initialAlveolarGasPartialPressure: inspired.helium,
        initialCompartmentGasPartialPressure: load.heliumPartialPressure,
        gasChangeRate: heliumChangeRate,
        gasTimeConstant: inertGasTimeConstant({
          inertGasHalfTime: buhlmannCompartments[index].He.halfTime
        }),
        intervalTime: duration
      })
    }))
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter dive-planner exec jest src/compartment-integrator.test.ts`
Expected: PASS — including all pre-existing OC integrator tests (OC behaviour is unchanged because the OC branch is numerically identical to the old code).

- [ ] **Step 5: Commit**

```bash
git add packages/dive-planner/src/compartment-integrator.ts packages/dive-planner/src/compartment-integrator.test.ts
git commit -m "feat(dive-planner): integrator computes inspired inert gas via breathing-source"
```

---

## Task 4: Interpolator tags segments with circuit + phase setpoint

**Files:**
- Modify: `packages/dive-planner/src/levels-to-segments-interpolator.ts`
- Modify: `packages/dive-planner/src/levels-to-segments-interpolator.test.ts`

The interpolator currently builds OC segments. In CCR mode it must (a) use the **diluent** as the segment gas, and (b) tag DESCENT/NAVIGATION with `setpointLow` and ASCENT with `setpointHigh`.

- [ ] **Step 1: Write the failing test**

Add to `packages/dive-planner/src/levels-to-segments-interpolator.test.ts`:

```ts
import { createLevelsToSegmentsInterpolator } from './levels-to-segments-interpolator'
import { DiveProfileIntervalType } from './types'

describe('levels-to-segments — CCR', () => {
  const diluent = { fO2: 0.21, fHe: 0, isDecoGas: false }
  const bottomGas = { fO2: 0.21, fHe: 0.35, isDecoGas: false }

  it('uses the diluent and tags descent with low setpoint and ascent with high setpoint', () => {
    const interpolator = createLevelsToSegmentsInterpolator()
    const segments = interpolator.interpolate(
      [
        { depth: 40, duration: 20, gas: bottomGas },
        { depth: 20, duration: 10, gas: bottomGas }
      ],
      {
        descentRate: 20,
        ascentRate: 9,
        circuit: 'CCR',
        diluent,
        setpointLow: 0.7,
        setpointHigh: 1.3
      }
    )

    const descent = segments.find(s => s.type === DiveProfileIntervalType.DESCENT)!
    const navigation = segments.find(s => s.type === DiveProfileIntervalType.NAVIGATION)!
    const ascent = segments.find(s => s.type === DiveProfileIntervalType.ASCENT)!

    expect(descent.gas).toBe(diluent)
    expect(descent.circuit).toBe('CCR')
    expect(descent.setpoint).toBe(0.7)
    expect(navigation.setpoint).toBe(0.7)
    expect(ascent.setpoint).toBe(1.3)
  })

  it('leaves segments untouched (OC, no setpoint) when circuit is omitted', () => {
    const interpolator = createLevelsToSegmentsInterpolator()
    const segments = interpolator.interpolate(
      [{ depth: 40, duration: 20, gas: bottomGas }],
      { descentRate: 20, ascentRate: 9 }
    )

    expect(segments[0].circuit).toBeUndefined()
    expect(segments[0].setpoint).toBeUndefined()
    expect(segments[0].gas).toBe(bottomGas)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter dive-planner exec jest src/levels-to-segments-interpolator.test.ts`
Expected: FAIL — the second arg type has no `circuit`, and segments carry no `circuit`/`setpoint`.

- [ ] **Step 3: Implement CCR tagging in the interpolator**

Rewrite `packages/dive-planner/src/levels-to-segments-interpolator.ts`:

```ts
import {last, reduce} from "ramda";

import {
  DivePlanLevel,
  DivePlanSpeedOptions,
  DiveProfileIntervalType,
  DiveSegment,
  Gas
} from "./types";

interface CircuitInterpolationOptions {
  circuit?: 'OC' | 'CCR'
  diluent?: Gas
  setpointLow?: number
  setpointHigh?: number
}

type InterpolationOptions = DivePlanSpeedOptions & CircuitInterpolationOptions

export const createLevelsToSegmentsInterpolator = () => {
  const interpolate = (
    levels: DivePlanLevel[],
    {descentRate, ascentRate, circuit, diluent, setpointLow, setpointHigh}: InterpolationOptions
  ) => {
    const isCcr = circuit === 'CCR'

    const decorate = (segment: DiveSegment): DiveSegment => {
      if (!isCcr) return segment
      const isAscent = segment.type === DiveProfileIntervalType.ASCENT
      return {
        ...segment,
        gas: diluent ?? segment.gas,
        circuit: 'CCR',
        setpoint: isAscent ? setpointHigh : setpointLow
      }
    }

    return reduce(
      (intervalsAcc: DiveSegment[], level: DivePlanLevel) => {
        const {
          finalDepth: initialDepth = 0,
          finalTime: initialTime = 0
        } = last(intervalsAcc) ?? {}

        const {duration, depth: finalDepth, gas} = level

        const depthDelta = finalDepth - initialDepth
        const rate = depthDelta < 0 ? ascentRate : descentRate
        const deltaIntervalType =
          depthDelta < 0 ? DiveProfileIntervalType.ASCENT : DiveProfileIntervalType.DESCENT
        const timeDelta = Math.abs(depthDelta / rate)

        const deltaInterval = decorate({
          type: deltaIntervalType,
          initialTime,
          finalTime: initialTime + timeDelta,
          initialDepth,
          finalDepth,
          gas
        })

        if (timeDelta >= duration) {
          return [...intervalsAcc, deltaInterval]
        }

        const navigationInterval = decorate({
          type: DiveProfileIntervalType.NAVIGATION,
          initialTime: deltaInterval.finalTime,
          finalTime: deltaInterval.initialTime + duration,
          initialDepth: deltaInterval.finalDepth,
          finalDepth: deltaInterval.finalDepth,
          gas
        })

        if (timeDelta === 0) {
          return [...intervalsAcc, navigationInterval]
        }

        return [...intervalsAcc, deltaInterval, navigationInterval]
      },
      [],
      levels
    )
  }

  return { interpolate }
}
export default createLevelsToSegmentsInterpolator()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter dive-planner exec jest src/levels-to-segments-interpolator.test.ts`
Expected: PASS — new CCR tests plus all existing OC interpolator tests.

- [ ] **Step 5: Commit**

```bash
git add packages/dive-planner/src/levels-to-segments-interpolator.ts packages/dive-planner/src/levels-to-segments-interpolator.test.ts
git commit -m "feat(dive-planner): tag CCR segments with diluent and phase setpoints"
```

---

## Task 5: Deco algorithm — seedable state + CCR ascent

**Files:**
- Modify: `packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.ts`
- Modify: `packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.test.ts`

Two changes: (a) extract a `decompressFromState` entry so the deco phase can run from arbitrary seeded loads/depth (needed by bailout in Task 6); (b) when the bottom segments are CCR, hold the diluent at `setpointHigh` for all generated ascent/stop segments and **skip** the deco-gas selector / switch-at-MOD machinery.

- [ ] **Step 1: Write the failing test**

Add to `packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.test.ts`:

```ts
import { createBuhlmannZHL16Algorithm } from './buhlmannZHL16-decompression-algorithm'
import { DiveProfileIntervalType, DiveSegment } from './types'

describe('Bühlmann algorithm — CCR bottom phase', () => {
  const diluent = { fO2: 0.21, fHe: 0, isDecoGas: false }

  const ccrBottom: DiveSegment[] = [
    { type: DiveProfileIntervalType.DESCENT, initialDepth: 0, finalDepth: 40, initialTime: 0, finalTime: 2, gas: diluent, circuit: 'CCR', setpoint: 0.7 },
    { type: DiveProfileIntervalType.NAVIGATION, initialDepth: 40, finalDepth: 40, initialTime: 2, finalTime: 30, gas: diluent, circuit: 'CCR', setpoint: 0.7 }
  ]

  it('keeps the diluent on the loop at the high setpoint through ascent/deco (no gas switches)', () => {
    const algorithm = createBuhlmannZHL16Algorithm({}, {
      gradientFactors: { gfLow: 0.3, gfHigh: 0.85 },
      circuit: 'CCR',
      setpointHigh: 1.3,
      // deco gases present but must be ignored in CCR mode
      availableGases: [{ fO2: 0.5, fHe: 0, isDecoGas: true }]
    })

    const profile = algorithm.calculateDiveProfileFromSegments({ segments: ccrBottom })
    const generated = profile.intervals.filter(
      s => s.type === DiveProfileIntervalType.ASCENT || s.type === DiveProfileIntervalType.DECO_STOP
    )

    expect(generated.length).toBeGreaterThan(0)
    expect(generated.every(s => s.gas === diluent)).toBe(true)
    expect(generated.every(s => s.circuit === 'CCR' && s.setpoint === 1.3)).toBe(true)
    expect(generated.some(s => s.isGasSwitch)).toBe(false)
  })

  it('decompressFromState runs an OC ascent from seeded loads', () => {
    const algorithm = createBuhlmannZHL16Algorithm({}, {
      gradientFactors: { gfLow: 0.3, gfHigh: 0.85 }
    })

    // Seed with surface-saturated loads at depth 0 → no deco required.
    const seeded = algorithm.decompressFromState({
      loads: algorithm.surfaceSaturatedLoads(),
      depth: 0,
      time: 0,
      backGas: { fO2: 0.21, fHe: 0, isDecoGas: false },
      decoGases: []
    })

    expect(seeded.intervals).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter dive-planner exec jest src/buhlmannZHL16-decompression-algorithm.test.ts`
Expected: FAIL — `circuit`/`setpointHigh` options unknown, `decompressFromState` and `surfaceSaturatedLoads` not exported.

- [ ] **Step 3: Add CCR options and the seedable entry point**

In `packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.ts`:

Add to `AlgorithmOptions` (after `lastStopDepth?: number` at line 84):

```ts
  /** `'CCR'` keeps the diluent on the loop at `setpointHigh` for the whole
   *  ascent and bypasses the OC deco-gas machinery. Defaults to `'OC'`. */
  circuit?: 'OC' | 'CCR'
  /** pO₂ setpoint (bar) held on ascent + deco in CCR mode. */
  setpointHigh?: number
```

Read the options near line 112, adding:

```ts
  const circuit = options.circuit ?? 'OC'
  const setpointHigh = options.setpointHigh
```

Tag generated segments. In `appendAscentTo`, change the `ascentSegment` literal (lines 230-238) to include circuit/setpoint:

```ts
    const ascentSegment: DiveSegment = {
      type: DiveProfileIntervalType.ASCENT,
      initialDepth: startDepth,
      finalDepth: targetDepth,
      initialTime: run.runTime,
      finalTime: run.runTime + duration,
      gas,
      isGasSwitch: isSwitchFromPrevious(run, gas),
      ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
    }
```

And in `appendAscentTo`, the integrator call (lines 241-249) must pass circuit/setpoint:

```ts
      loads: compartmentIntegrator.advance({
        compartmentLoads: run.loads,
        segment: {
          initialDepth: startDepth,
          finalDepth: targetDepth,
          duration,
          gas,
          circuit,
          setpoint: setpointHigh
        }
      }),
```

In `appendStop`, change the `stopSegment` literal (lines 339-347):

```ts
    const stopSegment: DiveSegment = {
      type: DiveProfileIntervalType.DECO_STOP,
      initialDepth: stopDepth,
      finalDepth: stopDepth,
      initialTime: run.runTime,
      finalTime: run.runTime + duration,
      gas,
      isGasSwitch: isSwitchFromPrevious(run, gas),
      ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
    }
```

In `holdAtStopUntilClearedFor`, the `segmentTemplate` (lines 271-276) must integrate on the loop:

```ts
    const segmentTemplate = {
      initialDepth: stopDepth,
      finalDepth: stopDepth,
      duration: stopTimeStep,
      gas,
      circuit,
      setpoint: setpointHigh
    }
```

In CCR mode the deco-gas selection in `appendStop` must be skipped — the gas is always the back gas (diluent). Change the start of `appendStop` (lines 314-318) to:

```ts
    const gas = circuit === 'CCR'
      ? backGas
      : decoGasSelector.select({
          availableGases: decoGases,
          backGas,
          ambientPressure: depthPressureConverter.depthToAmbientPressure(stopDepth)
        })
```

- [ ] **Step 4: Extract `decompressFromState` and expose helpers**

Still in the same file, refactor the deco phase out of `calculateDiveProfileFromSegments` so it can be driven from seeded state.

Add this function (place it just before `calculateDiveProfileFromSegments`, after `walkStops`):

```ts
  const decompressFromState = ({
    loads,
    depth,
    time,
    backGas,
    decoGases
  }: {
    loads: CompartmentInertLoad[]
    depth: number
    time: number
    backGas: Gas
    decoGases: Gas[]
  }): DiveProfile => {
    const seededRun: AlgorithmRun = {
      loads,
      intervals: [{
        type: DiveProfileIntervalType.NAVIGATION,
        initialDepth: depth,
        finalDepth: depth,
        initialTime: time,
        finalTime: time,
        gas: backGas,
        ...(circuit === 'CCR' ? { circuit, setpoint: setpointHigh } : {})
      }],
      runTime: time
    }

    const naturalFirstStop = firstStopDepth(loads)
    const forcedSwitchDepth = Math.min(
      deepestGasSwitchDepth(decoGases),
      roundDownToStopGrid(depth)
    )
    const useSwitchAtMod = switchAtMod && circuit === 'OC'
    const decoFirstStop = useSwitchAtMod
      ? Math.max(naturalFirstStop, forcedSwitchDepth)
      : naturalFirstStop

    if (decoFirstStop <= 0) {
      const surfaceRun = appendAscentTo({ run: seededRun, targetDepth: 0, gas: backGas })
      // Drop the zero-length seed marker before returning.
      return { intervals: mergeConsecutiveAscents(surfaceRun.intervals.slice(1)) }
    }

    const firstStop = Math.max(decoFirstStop, lastStopDepth)
    const runAfterFirstAscent = appendAscentTo({ run: seededRun, targetDepth: firstStop, gas: backGas })
    const runAfterStops = walkStops({ runAfterFirstAscent, diveFirstStop: firstStop, backGas, decoGases })

    return { intervals: mergeConsecutiveAscents(runAfterStops.intervals.slice(1)) }
  }
```

Note: the seed interval is a zero-length `NAVIGATION` at the start depth so `appendAscentTo` knows the starting depth/time and `isSwitchFromPrevious` has a previous gas; `.slice(1)` removes it from the returned intervals.

Now simplify `calculateDiveProfileFromSegments` (lines 383-446) to reuse it:

```ts
  const calculateDiveProfileFromSegments = ({ segments }: AlgorithmInput): DiveProfile => {
    if (segments.length === 0) return { intervals: [] }

    const userRun = integrateUserSegments(segments)
    const lastSegment = userRun.intervals[userRun.intervals.length - 1]
    const backGas = lastSegment.gas
    const lastDepth = lastSegment.finalDepth

    const useSwitchAtMod = switchAtMod && circuit === 'OC'
    const decoGases = useSwitchAtMod
      ? gasesAfterDeepMODExclusion(averageDepthOf(userRun.intervals))
      : circuit === 'CCR' ? [] : availableGases

    const deco = decompressFromState({
      loads: userRun.loads,
      depth: lastDepth,
      time: userRun.runTime,
      backGas,
      decoGases
    })

    return { intervals: mergeConsecutiveAscents([...userRun.intervals, ...deco.intervals]) }
  }
```

Expose the new entry points and a surface-saturated helper. Change the `return` of the factory (lines 448-452) to:

```ts
  const fromSegments = (segments: DiveSegment[]): DiveProfile =>
    calculateDiveProfileFromSegments({ segments })

  return {
    calculateDiveProfileFromSegments: fromSegments,
    decompressFromState,
    surfaceSaturatedLoads: compartmentIntegrator.initialCompartmentLoads
  }
```

Ensure `DiveProfile` is imported (it is already imported from `./types` at line 38).

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter dive-planner exec jest src/buhlmannZHL16-decompression-algorithm.test.ts`
Expected: PASS — new CCR tests plus all existing OC schedule tests (OC path is behaviour-preserving: `circuit` defaults to `'OC'`, deco-gas logic unchanged, and `[...userRun.intervals, ...deco.intervals]` reproduces the previous output because `mergeConsecutiveAscents` was already applied to the same sequence).

- [ ] **Step 6: Run the whole planner suite to catch regressions**

Run: `pnpm --filter dive-planner exec jest`
Expected: PASS — entire planner suite green.

- [ ] **Step 7: Commit**

```bash
git add packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.ts packages/dive-planner/src/buhlmannZHL16-decompression-algorithm.test.ts
git commit -m "feat(dive-planner): CCR ascent on loop + seedable decompressFromState"
```

---

## Task 6: Dive planner emits primary + bailout profile

**Files:**
- Modify: `packages/dive-planner/src/dive-planner.ts`
- Modify: `packages/dive-planner/src/dive-planner.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `packages/dive-planner/src/dive-planner.test.ts`:

```ts
import { createDivePlanner } from './dive-planner'
import { DiveProfileIntervalType } from './types'

describe('dive planner — CCR with bailout', () => {
  const diluent = { fO2: 0.21, fHe: 0, isDecoGas: false }
  const deco50 = { fO2: 0.5, fHe: 0, isDecoGas: true }

  it('returns a loop profile plus an OC bailout schedule from end of bottom time', () => {
    const planner = createDivePlanner()

    const profile = planner.calculateDiveProfileFromPlan({
      descentRate: 20,
      ascentRate: 9,
      gradientFactorLow: 0.3,
      gradientFactorHigh: 0.85,
      circuit: 'CCR',
      diluent,
      setpointLow: 0.7,
      setpointHigh: 1.3,
      availableGases: [diluent, deco50],
      levels: [{ depth: 45, duration: 30, gas: diluent }]
    })

    // Primary schedule is on the loop (CCR-tagged generated segments).
    const generated = profile.intervals.filter(
      s => s.type === DiveProfileIntervalType.DECO_STOP
    )
    expect(generated.every(s => s.circuit === 'CCR')).toBe(true)

    // Bailout exists and is open circuit (no CCR tags on its segments).
    expect(profile.bailout).toBeDefined()
    expect(profile.bailout!.intervals.length).toBeGreaterThan(0)
    expect(profile.bailout!.intervals.every(s => s.circuit !== 'CCR')).toBe(true)
  })

  it('omits bailout for an OC plan', () => {
    const planner = createDivePlanner()
    const profile = planner.calculateDiveProfileFromPlan({
      descentRate: 20,
      ascentRate: 9,
      gradientFactorLow: 0.3,
      gradientFactorHigh: 0.85,
      availableGases: [diluent],
      levels: [{ depth: 30, duration: 20, gas: diluent }]
    })

    expect(profile.bailout).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter dive-planner exec jest src/dive-planner.test.ts`
Expected: FAIL — `circuit`/`diluent`/`setpoint*` not passed through; no `bailout` produced.

- [ ] **Step 3: Implement circuit pass-through and bailout assembly**

Rewrite `packages/dive-planner/src/dive-planner.ts`:

```ts
import { DivePlan, DiveProfile, DiveSegment } from './types'

import { createBuhlmannZHL16Algorithm } from './buhlmannZHL16-decompression-algorithm'
import { createCompartmentIntegrator, EnvironmentOptions } from './compartment-integrator'
import defaultLevelsToSegmentsInterpolator from './levels-to-segments-interpolator'

interface DecompressionAlgorithm {
  calculateDiveProfileFromSegments: (segments: DiveSegment[]) => DiveProfile
}

interface DivePlannerDependencies {
  buildDecompressionAlgorithm?: (plan: DivePlan) => DecompressionAlgorithm
  levelsToSegmentsInterpolator?: typeof defaultLevelsToSegmentsInterpolator
}

interface DivePlanner {
  /** @deprecated use `calculateDiveProfileFromPlan`. */
  calculateDiveProfileFromPlanV1: (plan: DivePlan) => DiveSegment[]
  calculateDiveProfileFromPlan: (plan: DivePlan) => DiveProfile
}

const DEFAULT_ENVIRONMENT: EnvironmentOptions = {
  surfaceAmbientPressure: 1.0133,
  waterDensity: 1023.6,
  waterVaporPressure: 0.0567
}

const environmentOf = (plan: DivePlan): EnvironmentOptions | undefined =>
  plan.surfaceAmbientPressure !== undefined &&
  plan.waterDensity !== undefined &&
  plan.waterVaporPressure !== undefined
    ? {
        surfaceAmbientPressure: plan.surfaceAmbientPressure,
        waterDensity: plan.waterDensity,
        waterVaporPressure: plan.waterVaporPressure
      }
    : undefined

const gradientFactorsOf = (plan: DivePlan) =>
  plan.gradientFactorLow !== undefined && plan.gradientFactorHigh !== undefined
    ? { gfLow: plan.gradientFactorLow, gfHigh: plan.gradientFactorHigh }
    : undefined

const buildAlgorithm = (plan: DivePlan) =>
  createBuhlmannZHL16Algorithm({}, {
    ascentRate: plan.ascentRate,
    gradientFactors: gradientFactorsOf(plan),
    environment: environmentOf(plan),
    availableGases: plan.availableGases,
    switchAtMod: plan.switchAtMod,
    lastStopDepth: plan.lastStopDepth,
    circuit: plan.circuit,
    setpointHigh: plan.setpointHigh
  })

const defaultBuildDecompressionAlgorithm = (plan: DivePlan): DecompressionAlgorithm =>
  buildAlgorithm(plan)

export const createDivePlanner = (dependencies: DivePlannerDependencies = {}): DivePlanner => {
  const {
    buildDecompressionAlgorithm = defaultBuildDecompressionAlgorithm,
    levelsToSegmentsInterpolator = defaultLevelsToSegmentsInterpolator
  } = dependencies

  const calculateUserSegments = (plan: DivePlan): DiveSegment[] =>
    levelsToSegmentsInterpolator.interpolate(plan.levels, {
      descentRate: plan.descentRate,
      ascentRate: plan.ascentRate,
      circuit: plan.circuit,
      diluent: plan.diluent,
      setpointLow: plan.setpointLow,
      setpointHigh: plan.setpointHigh
    })

  // The bailout schedule: assume the unit fails at the end of bottom time, then
  // decompress open-circuit from that point on the diluent (breathed OC) as the
  // back gas plus the available deco gases.
  const calculateBailout = (plan: DivePlan, userSegments: DiveSegment[]): DiveProfile | undefined => {
    if (plan.circuit !== 'CCR') return undefined
    if (userSegments.length === 0) return undefined

    const environment = environmentOf(plan) ?? DEFAULT_ENVIRONMENT
    const integrator = createCompartmentIntegrator(environment)
    const loads = userSegments.reduce(
      (acc, segment) =>
        integrator.advance({
          compartmentLoads: acc,
          segment: {
            initialDepth: segment.initialDepth,
            finalDepth: segment.finalDepth,
            duration: segment.finalTime - segment.initialTime,
            gas: segment.gas,
            circuit: segment.circuit,
            setpoint: segment.setpoint
          }
        }),
      integrator.initialCompartmentLoads()
    )

    const lastSegment = userSegments[userSegments.length - 1]
    // OC algorithm: switchAtMod follows the plan, but circuit is forced OC.
    const ocAlgorithm = createBuhlmannZHL16Algorithm({}, {
      ascentRate: plan.ascentRate,
      gradientFactors: gradientFactorsOf(plan),
      environment: environmentOf(plan),
      availableGases: plan.availableGases,
      switchAtMod: plan.switchAtMod,
      lastStopDepth: plan.lastStopDepth,
      circuit: 'OC'
    })

    return ocAlgorithm.decompressFromState({
      loads,
      depth: lastSegment.finalDepth,
      time: lastSegment.finalTime,
      backGas: plan.diluent ?? lastSegment.gas,
      decoGases: (plan.availableGases ?? []).filter(gas => gas.isDecoGas)
    })
  }

  const calculateDiveProfileFromPlan = (plan: DivePlan): DiveProfile => {
    const segments = calculateUserSegments(plan)
    const primary = buildDecompressionAlgorithm(plan).calculateDiveProfileFromSegments(segments)
    const bailout = calculateBailout(plan, segments)
    return bailout ? { ...primary, bailout } : primary
  }

  return {
    calculateDiveProfileFromPlanV1: calculateUserSegments,
    calculateDiveProfileFromPlan
  }
}

export default createDivePlanner()
```

Note: `decompressFromState` is only present on the concrete algorithm, not the injected `DecompressionAlgorithm` interface — `calculateBailout` builds its own OC algorithm directly via `createBuhlmannZHL16Algorithm`, so the dependency-injection seam is unaffected.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter dive-planner exec jest src/dive-planner.test.ts`
Expected: PASS — CCR returns `bailout`, OC does not.

- [ ] **Step 5: Run full planner suite + rebuild for downstream**

Run: `pnpm --filter dive-planner exec jest`
Then: `pnpm --filter dive-planner build`
Expected: all planner tests PASS; tsup builds `dist` cleanly so the web app picks up the new behaviour.

- [ ] **Step 6: Commit**

```bash
git add packages/dive-planner/src/dive-planner.ts packages/dive-planner/src/dive-planner.test.ts
git commit -m "feat(dive-planner): emit OC bailout schedule for CCR plans"
```

---

## Task 7: Web state — circuit, setpoints, diluent

**Files:**
- Modify: `apps/web/state/dive-plan/types.ts`
- Modify: `apps/web/state/dive-plan/slice.ts`
- Modify: `apps/web/state/dive-plan/initial.ts`

- [ ] **Step 1: Add fields to the state type**

In `apps/web/state/dive-plan/types.ts`, add to the `DivePlan` interface (after `lastStopDepth` at line 14):

```ts
  circuit: 'OC' | 'CCR'       // breathing circuit; 'OC' is the default
  setpointLow: number         // CCR pO₂ setpoint (bar) on descent + bottom
  setpointHigh: number        // CCR pO₂ setpoint (bar) on ascent + deco
  diluentGasId: string        // id (into gasesMap) of the CCR diluent gas
```

- [ ] **Step 2: Add actions + reducers to the slice**

In `apps/web/state/dive-plan/slice.ts`, add to `DivePlanActions` (after `setLastStopDepth` at line 13):

```ts
  setCircuit: (value: 'OC' | 'CCR') => void
  setSetpointLow: (value: number) => void
  setSetpointHigh: (value: number) => void
  setDiluentGasId: (value: string) => void
```

Add the reducers inside the `immer` factory (after the `setLastStopDepth` reducer, around line 65):

```ts
      setCircuit: value =>
        set(state => {
          state.circuit = value
        }),
      setSetpointLow: value =>
        set(state => {
          state.setpointLow = value
        }),
      setSetpointHigh: value =>
        set(state => {
          state.setpointHigh = value
        }),
      setDiluentGasId: value =>
        set(state => {
          state.diluentGasId = value
        }),
```

- [ ] **Step 3: Add defaults to initial state**

In `apps/web/state/dive-plan/initial.ts`, import the bottom gas id (already imported as `bottomGasId`) and add to the `initialDivePlan` object (after `lastStopDepth: 6,`):

```ts
  circuit: 'OC',
  setpointLow: 0.7,
  setpointHigh: 1.3,
  diluentGasId: bottomGasId,
```

- [ ] **Step 4: Verify the web app type-checks and existing tests pass**

Run: `pnpm --filter web exec jest`
Expected: PASS — existing web tests still green (new state fields are additive).

- [ ] **Step 5: Commit**

```bash
git add apps/web/state/dive-plan/types.ts apps/web/state/dive-plan/slice.ts apps/web/state/dive-plan/initial.ts
git commit -m "feat(web): add CCR circuit/setpoint/diluent to dive-plan state"
```

---

## Task 8: Web selectors pass-through + chart util uses breathing-source

**Files:**
- Modify: `apps/web/state/dive-plan/selectors.ts`
- Modify: `apps/web/utils/calculate-dive-profile.ts`
- Modify: `apps/web/utils/calculate-dive-profile.test.ts`

- [ ] **Step 1: Write the failing test for the chart util**

Add to `apps/web/utils/calculate-dive-profile.test.ts`:

```ts
import { calculateDiveProfile } from './calculate-dive-profile'
import { DiveProfileIntervalType, type DiveSegment } from 'dive-planner'

describe('calculateDiveProfile — gas-aware loading', () => {
  const trimix = { fO2: 0.18, fHe: 0.45, isDecoGas: false }

  const segment: DiveSegment = {
    type: DiveProfileIntervalType.NAVIGATION,
    initialDepth: 40,
    finalDepth: 40,
    initialTime: 0,
    finalTime: 20,
    gas: trimix
  }

  it('loads helium on a trimix segment (not hardcoded to air)', () => {
    const samples = calculateDiveProfile([segment], {
      gfLow: 0.3,
      gfHigh: 0.85,
      firstStopAmbientPressure: 2.8
    })

    const last = samples[samples.length - 1]
    expect(last.compartmentInertGasLoads[0].He).toBeGreaterThan(0)
  })

  it('on a CCR segment loads less nitrogen than the same depth on OC air', () => {
    const air = { fO2: 0.21, fHe: 0, isDecoGas: false }
    const ocSeg: DiveSegment = { ...segment, gas: air }
    const ccrSeg: DiveSegment = { ...segment, gas: air, circuit: 'CCR', setpoint: 1.3 }

    const oc = calculateDiveProfile([ocSeg], { gfLow: 0.3, gfHigh: 0.85, firstStopAmbientPressure: 2.8 })
    const ccr = calculateDiveProfile([ccrSeg], { gfLow: 0.3, gfHigh: 0.85, firstStopAmbientPressure: 2.8 })

    const ocLast = oc[oc.length - 1].compartmentInertGasLoads[0].N2
    const ccrLast = ccr[ccr.length - 1].compartmentInertGasLoads[0].N2
    expect(ccrLast).toBeLessThan(ocLast)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web exec jest utils/calculate-dive-profile.test.ts`
Expected: FAIL — helium load is 0 (air hardcoded), and CCR equals OC.

- [ ] **Step 3: Refactor the chart util to use the breathing-source strategy**

In `apps/web/utils/calculate-dive-profile.ts`:

Change the imports (lines 1-14) to drop the now-unused `alveolarInertGasPartialPressure`/`inspiredGasChangeRate` and add `inspiredInertGas`:

```ts
import {
  alveolarWaterVaporPressure,
  buhlmannCompartments,
  CompartmentInertGasLoad,
  divingCeilingAmbientPressure,
  fromDepthToHydrostaticPressure,
  getSurfaceSaturatedCompartmentInertGasLoads,
  gradientFactorAt,
  inertGasTimeConstant,
  inspiredInertGas,
  schreinerEquation
} from "dive-physics";
import {DiveSegment} from "dive-planner";
import { pipe} from "ramda";
```

Replace the `DiveProfileIntervalWithAlveolarInertGasPressures` interface (lines 59-64) so it also carries the change-rate factors:

```ts
interface DiveProfileIntervalWithAlveolarInertGasPressures extends DiveProfileIntervalWithDescentRate {
  startAlveolarInertGasPressures: {
    N2: number
    He: number
    N2ChangeRateFactor: number
    HeChangeRateFactor: number
  }
}
```

Replace `calculateAlveolarInertGasPressures` (lines 85-100) with a gas/circuit-aware version:

```ts
const calculateAlveolarInertGasPressures: (interval: DiveProfileIntervalWithDescentRate) => DiveProfileIntervalWithAlveolarInertGasPressures =
  interval => {
    const inspired = inspiredInertGas({
      circuit: interval.circuit ?? 'OC',
      ambientPressure: interval.initialAmbientPressure,
      waterVaporPressure,
      gas: interval.gas,
      setpoint: interval.setpoint
    })
    return {
      ...interval,
      startAlveolarInertGasPressures: {
        N2: inspired.nitrogen,
        He: inspired.helium,
        N2ChangeRateFactor: inspired.nitrogenChangeRateFactor,
        HeChangeRateFactor: inspired.heliumChangeRateFactor
      }
    }
  }
```

Replace the two `gasChangeRate` calls in `calculateCompartmentInertGasLoad` (lines 145-148 and 157-160) so they multiply the descent rate by the factor instead of using the hardcoded `0.79`/`0`:

For N2:

```ts
            gasChangeRate: interval.descentRate * interval.startAlveolarInertGasPressures.N2ChangeRateFactor,
```

For He:

```ts
            gasChangeRate: interval.descentRate * interval.startAlveolarInertGasPressures.HeChangeRateFactor,
```

(Leave the rest of those `schreinerEquation` calls unchanged — they already read `startAlveolarInertGasPressures.N2`/`.He`.)

The `interpolateIntervals` mapping (lines 39-46) must carry `circuit`/`setpoint` onto each sub-interval. Add the two fields to the mapped object literal:

```ts
      ...Array.from({length: totalIntervals}).map((_, i) => ({
        type: interval.type,
        initialTime: interval.initialTime + (timeDelta * i),
        finalTime: interval.initialTime + (timeDelta * (i + 1)),
        initialDepth: interval.initialDepth + (depthDelta * i),
        finalDepth: interval.initialDepth + (depthDelta * (i + 1)),
        gas: interval.gas,
        circuit: interval.circuit,
        setpoint: interval.setpoint
      }))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web exec jest utils/calculate-dive-profile.test.ts`
Expected: PASS — helium loads on trimix; CCR N2 < OC N2.

- [ ] **Step 5: Pass the new plan fields through the selector**

In `apps/web/state/dive-plan/selectors.ts`, extend `diveIntervalsSelector` (lines 21-48) to read and forward the new fields. Change the destructured state and the planner call:

```ts
export const diveIntervalsSelector = memoize<StoreState, DiveSegment[]>(
  ({
    descentRate,
    ascentRate,
    gradientFactorLow,
    gradientFactorHigh,
    switchAtMod,
    lastStopDepth,
    circuit,
    setpointLow,
    setpointHigh,
    diluentGasId,
    diveLevelsMap,
    gasesMap,
    gasesIdList
  }: StoreState) =>
    divePlanner.calculateDiveProfileFromPlan({
      descentRate,
      ascentRate,
      gradientFactorLow,
      gradientFactorHigh,
      switchAtMod,
      lastStopDepth,
      circuit,
      setpointLow,
      setpointHigh,
      diluent: gasesMap[diluentGasId],
      availableGases: gasesIdList.map(id => gasesMap[id]).filter(Boolean),
      levels:
        Object.values(diveLevelsMap)
          .map(({gasId, ...diveLevel}) => ({
          ...diveLevel,
          gas: gasesMap[gasId]
        }))
    }).intervals
)
```

Add a selector exposing the bailout schedule (append at the end of the file):

```ts
export const bailoutIntervalsSelector = memoize<StoreState, DiveSegment[]>(
  ({
    descentRate,
    ascentRate,
    gradientFactorLow,
    gradientFactorHigh,
    switchAtMod,
    lastStopDepth,
    circuit,
    setpointLow,
    setpointHigh,
    diluentGasId,
    diveLevelsMap,
    gasesMap,
    gasesIdList
  }: StoreState) =>
    divePlanner.calculateDiveProfileFromPlan({
      descentRate,
      ascentRate,
      gradientFactorLow,
      gradientFactorHigh,
      switchAtMod,
      lastStopDepth,
      circuit,
      setpointLow,
      setpointHigh,
      diluent: gasesMap[diluentGasId],
      availableGases: gasesIdList.map(id => gasesMap[id]).filter(Boolean),
      levels:
        Object.values(diveLevelsMap)
          .map(({gasId, ...diveLevel}) => ({
          ...diveLevel,
          gas: gasesMap[gasId]
        }))
    }).bailout?.intervals ?? []
)
```

- [ ] **Step 6: Run the full web suite**

Run: `pnpm --filter web exec jest`
Expected: PASS — chart util + selector tests green, no regressions.

- [ ] **Step 7: Commit**

```bash
git add apps/web/state/dive-plan/selectors.ts apps/web/utils/calculate-dive-profile.ts apps/web/utils/calculate-dive-profile.test.ts
git commit -m "feat(web): gas/circuit-aware chart loading + CCR plan pass-through"
```

---

## Task 9: UI — circuit toggle, setpoint inputs, diluent picker

**Files:**
- Modify: `apps/web/components/app/algorithm-settings.tsx`

This is UI wiring with manual verification (the repo has no React component tests; the logic is covered by Tasks 7–8). The new controls reuse existing primitives: `Switch` (circuit), `InputWithUnits` (setpoints), and the existing `BottomGasSelector` (diluent — it already lists non-deco bottom gases via a `Select` and takes radix `value`/`onValueChange` props). New labels use literal strings to keep the task self-contained; moving them to the `useI18n` catalogue is a reasonable follow-up.

- [ ] **Step 1: Replace the component with the circuit-aware version**

Overwrite `apps/web/components/app/algorithm-settings.tsx` with:

```tsx
"use client"

import * as React from "react"

import {useStore} from "@/state/store"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {InputWithUnits} from "@/components/app/input-with-units"
import {BottomGasSelector} from "@/components/app/bottom-gas-selector"
import {useI18n} from "@/locales/client"

const parsePercentInput = (raw: string): number | null => {
  const parsed = parseInt(raw, 10)
  if (Number.isNaN(parsed)) return null
  if (parsed < 1 || parsed > 100) return null
  return parsed / 100
}

const parseSetpointInput = (raw: string): number | null => {
  const parsed = parseFloat(raw)
  if (Number.isNaN(parsed)) return null
  if (parsed < 0.4 || parsed > 1.6) return null
  return parsed
}

/**
 * The parameters that shape the decompression algorithm itself: circuit
 * (OC / CCR), gradient factors and the procedural switches. CCR adds the two
 * pO₂ setpoints and the diluent; the OC-only "switch at MOD" control is hidden
 * on the loop.
 */
export function AlgorithmSettings() {
  const t = useI18n()
  const gradientFactorLow = useStore.use.gradientFactorLow()
  const gradientFactorHigh = useStore.use.gradientFactorHigh()
  const switchAtMod = useStore.use.switchAtMod()
  const lastStopDepth = useStore.use.lastStopDepth()
  const setGradientFactorLow = useStore.use.setGradientFactorLow()
  const setGradientFactorHigh = useStore.use.setGradientFactorHigh()
  const setSwitchAtMod = useStore.use.setSwitchAtMod()
  const setLastStopDepth = useStore.use.setLastStopDepth()

  const circuit = useStore.use.circuit()
  const setpointLow = useStore.use.setpointLow()
  const setpointHigh = useStore.use.setpointHigh()
  const diluentGasId = useStore.use.diluentGasId()
  const setCircuit = useStore.use.setCircuit()
  const setSetpointLow = useStore.use.setSetpointLow()
  const setSetpointHigh = useStore.use.setSetpointHigh()
  const setDiluentGasId = useStore.use.setDiluentGasId()

  const isCcr = circuit === 'CCR'

  const handleCircuitChange = React.useCallback((checked: boolean) => {
    setCircuit(checked ? 'CCR' : 'OC')
  }, [setCircuit])

  const handleSetpointLowChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseSetpointInput(e.target.value)
    if (value !== null) setSetpointLow(value)
  }, [setSetpointLow])

  const handleSetpointHighChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseSetpointInput(e.target.value)
    if (value !== null) setSetpointHigh(value)
  }, [setSetpointHigh])

  const handleLastStopAt6Change = React.useCallback((checked: boolean) => {
    setLastStopDepth(checked ? 6 : 3)
  }, [setLastStopDepth])

  const handleGfLowChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorLow(value)
  }, [setGradientFactorLow])

  const handleGfHighChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parsePercentInput(e.target.value)
    if (value !== null) setGradientFactorHigh(value)
  }, [setGradientFactorHigh])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="flex items-start gap-3 md:col-span-2">
        <Switch
          id="circuit_ccr"
          checked={isCcr}
          onCheckedChange={handleCircuitChange}
        />
        <div className="grid gap-1">
          <Label htmlFor="circuit_ccr">Closed circuit (CCR)</Label>
          <p className="text-xs text-muted-foreground">
            Hold a constant pO₂ setpoint on the loop instead of breathing a fixed open-circuit mix.
          </p>
        </div>
      </div>

      {isCcr && (
        <>
          <div className="grid items-center gap-4">
            <Label htmlFor="setpoint_low">Setpoint — descent &amp; bottom</Label>
            <InputWithUnits
              id="setpoint_low"
              units="bar"
              type="number"
              value={setpointLow}
              onChange={handleSetpointLowChange}
              min={0.4}
              max={1.6}
              step={0.1}
            />
          </div>
          <div className="grid items-center gap-4">
            <Label htmlFor="setpoint_high">Setpoint — ascent &amp; deco</Label>
            <InputWithUnits
              id="setpoint_high"
              units="bar"
              type="number"
              value={setpointHigh}
              onChange={handleSetpointHighChange}
              min={0.4}
              max={1.6}
              step={0.1}
            />
          </div>
          <div className="grid items-center gap-4 md:col-span-2">
            <Label htmlFor="diluent">Diluent</Label>
            <BottomGasSelector
              value={diluentGasId}
              onValueChange={setDiluentGasId}
            />
          </div>
        </>
      )}

      <div className="grid items-center gap-4">
        <Label htmlFor="gf_low">{t('planner.settings.gradient_factor_low')}</Label>
        <InputWithUnits
          id="gf_low"
          units="%"
          type="number"
          value={Math.round(gradientFactorLow * 100)}
          onChange={handleGfLowChange}
          min={1}
          max={100}
          step={1}
        />
      </div>
      <div className="grid items-center gap-4">
        <Label htmlFor="gf_high">{t('planner.settings.gradient_factor_high')}</Label>
        <InputWithUnits
          id="gf_high"
          units="%"
          type="number"
          value={Math.round(gradientFactorHigh * 100)}
          onChange={handleGfHighChange}
          min={1}
          max={100}
          step={1}
        />
      </div>

      {!isCcr && (
        <div className="flex items-start gap-3 md:col-span-2 pt-2">
          <Switch
            id="switch_at_mod"
            checked={switchAtMod}
            onCheckedChange={setSwitchAtMod}
          />
          <div className="grid gap-1">
            <Label htmlFor="switch_at_mod">{t('planner.settings.switch_at_mod_label')}</Label>
            <p className="text-xs text-muted-foreground">
              {t('planner.settings.switch_at_mod_description')}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 md:col-span-2">
        <Switch
          id="last_stop_at_6"
          checked={lastStopDepth === 6}
          onCheckedChange={handleLastStopAt6Change}
        />
        <div className="grid gap-1">
          <Label htmlFor="last_stop_at_6">{t('planner.settings.last_stop_at_6_label')}</Label>
          <p className="text-xs text-muted-foreground">
            {t('planner.settings.last_stop_at_6_description')}
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Manual verification — run the app**

Run: `pnpm --filter web dev`
Then in the browser:
- The Algorithm card shows a "Closed circuit (CCR)" switch; default is off (OC) and the rest of the card is unchanged from before.
- Turn CCR on: the two setpoint inputs and the diluent selector appear, and the "switch at MOD" control hides.
- Change the high setpoint and confirm the deco schedule / profile chart recomputes.

Expected: controls behave as described; no console errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/app/algorithm-settings.tsx
git commit -m "feat(web): CCR circuit toggle, setpoint inputs, and diluent picker"
```

---

## Task 10: UI — render the bailout schedule

**Files:**
- Modify: `apps/web/components/app/decompression-table.tsx`

Extract the inline row mapping into a shared `ScheduleRows` component (DRY), used by both the primary schedule and the new bailout section. The bailout section renders only for CCR plans (non-empty `bailoutIntervalsSelector`). Labels use literal strings to keep the task self-contained.

- [ ] **Step 1: Replace the component with the shared-rows + bailout version**

Overwrite `apps/web/components/app/decompression-table.tsx` with:

```tsx
"use client"

import * as React from "react";
import {ArrowDown, ArrowRight, ArrowUp, Repeat, Timer} from "lucide-react";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DiveProfileIntervalType, DiveSegment} from "dive-planner";
import {useSelector} from "@/state/useSelector";
import {bailoutIntervalsSelector, diveIntervalsSelector} from "@/state/dive-plan/selectors";
import {GasBadge} from "@/components/app/gas-badge";
import {cn} from "@/lib/utils";
import {useI18n} from "@/locales/client";

const iconBySegmentType = {
  [DiveProfileIntervalType.DESCENT]:    <ArrowDown  className="text-blue-500"/>,
  [DiveProfileIntervalType.NAVIGATION]: <ArrowRight className="text-gray-500"/>,
  [DiveProfileIntervalType.ASCENT]:     <ArrowUp    className="text-red-500"/>,
  [DiveProfileIntervalType.DECO_STOP]:  <Timer      className="text-amber-500"/>
}

const useFormatDuration = () => {
  const t = useI18n()
  return React.useCallback((minutes: number): string => {
    if (minutes < 1) return t('planner.units.minutes_dotted_less_than_one')
    return t('planner.units.minutes_dotted', { count: Math.ceil(minutes) })
  }, [t])
}

const formatDepth = (depth: number): string => `${Math.round(depth)} m`

const segmentDuration = ({initialTime, finalTime}: DiveSegment): number =>
  finalTime - initialTime

const GasSwitchRow = ({segment}: {segment: DiveSegment}) => {
  const t = useI18n()
  return (
    <TableRow className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
      <TableCell><Repeat className="text-emerald-600"/></TableCell>
      <TableCell colSpan={2} className="font-medium text-emerald-900 dark:text-emerald-100">
        {t('planner.decompression.switch_gas_at', { depth: Math.round(segment.initialDepth) })}
      </TableCell>
      <TableCell className="text-right">
        <GasBadge gas={segment.gas}/>
      </TableCell>
    </TableRow>
  )
}

const ScheduleRows = ({segments, activeIndex = -1}: {segments: DiveSegment[]; activeIndex?: number}) => {
  const formatDuration = useFormatDuration()
  return (
    <>
      {segments.map((segment, i) => (
        <React.Fragment key={i}>
          {segment.isGasSwitch && <GasSwitchRow segment={segment}/>}
          <TableRow className={cn(i === activeIndex && "bg-muted")}>
            <TableCell>{iconBySegmentType[segment.type]}</TableCell>
            <TableCell className="font-medium">{formatDepth(segment.finalDepth)}</TableCell>
            <TableCell>{formatDuration(segmentDuration(segment))}</TableCell>
            <TableCell className="text-right">
              <GasBadge gas={segment.gas}/>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </>
  )
}

export const DecompressionTable = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const t = useI18n()
  const diveIntervals = useSelector(diveIntervalsSelector)
  const bailoutIntervals = useSelector(bailoutIntervalsSelector)
  const hoverTime = useSelector(state => state.hoverTime)

  // The segment whose time range contains the time hovered/pinned on the chart.
  const activeIndex = hoverTime === null
    ? -1
    : diveIntervals.findIndex(segment => hoverTime <= segment.finalTime)

  const bailoutFromDepth = bailoutIntervals[0]?.initialDepth

  return (
    <div className={cn("[&_th]:px-2 [&_td]:px-2", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0"/>
            <TableHead>{t('planner.levels.depth')}</TableHead>
            <TableHead>{t('planner.levels.duration')}</TableHead>
            <TableHead className="text-right">{t('planner.levels.gas')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <ScheduleRows segments={diveIntervals} activeIndex={activeIndex}/>
        </TableBody>
      </Table>

      {bailoutIntervals.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            {`Bailout — open circuit from ${formatDepth(bailoutFromDepth ?? 0)} (end of bottom time)`}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-0"/>
                <TableHead>{t('planner.levels.depth')}</TableHead>
                <TableHead>{t('planner.levels.duration')}</TableHead>
                <TableHead className="text-right">{t('planner.levels.gas')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ScheduleRows segments={bailoutIntervals}/>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Manual verification — run the app**

Run: `pnpm --filter web dev`
Then in the browser, with a CCR plan deep enough to require deco (e.g. 45 m / 30 min):
- A "Bailout — open circuit from N m (end of bottom time)" section appears below the primary schedule, showing OC gas switches (e.g. to EAN50/O₂) — distinct from the loop schedule which stays on the diluent.
- Switch back to OC: the bailout section disappears.

Expected: bailout renders for CCR, hidden for OC; no console errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/app/decompression-table.tsx
git commit -m "feat(web): render OC bailout schedule for CCR plans"
```

---

## Final verification

- [ ] **Step 1: Build everything and run all tests**

Run: `pnpm build && pnpm test`
Expected: all packages build; `dive-physics`, `dive-planner`, and `web` test suites all PASS.

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: no new lint errors.

- [ ] **Step 3: Manual end-to-end check**

Run: `pnpm --filter web dev` and verify a full CCR dive (e.g. 45 m / 30 min, trimix diluent, setpoints 0.7/1.3): the loop schedule, profile chart, compartment charts, and bailout table all render coherently, and toggling back to OC restores the original behaviour.
