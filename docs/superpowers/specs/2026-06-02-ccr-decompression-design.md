# CCR Decompression Planning — Design

**Date:** 2026-06-02
**Status:** Approved (pending implementation plan)

## Summary

Add closed-circuit-rebreather (CCR) support to the dive planner alongside the
existing open-circuit (OC) mode. The user picks a circuit type — **OC
(default)** or **CCR** — per plan. In CCR mode the loop holds a constant oxygen
setpoint, so the inspired inert-gas partial pressure is derived from the
setpoint and the diluent composition rather than from a fixed gas mix. The
decompression schedule is computed with the same Bühlmann ZH-L16C + gradient
factor machinery; only the inspired-inert-gas inputs to the Schreiner equation
change.

The reference for the CCR physics is the "CCR Schreiner equation" article
(thetheoreticaldiver.org, 2017-11-30).

## Background: the physics

The Schreiner equation and the 16-compartment integration are **unchanged**.
The only thing that differs between OC and CCR is how a segment's inspired
inert-gas partial pressure — and its rate of change with depth — is computed.

- **Open circuit** (fixed mix, fractions `fO2`/`fHe`):
  - inspired inert pp `= (Pa − Pwv) · F_ig`
  - change-rate factor `= F_ig` (multiplied by the ambient-pressure change rate)
- **Closed circuit** (constant pO₂ setpoint `p_s`, diluent with `fO2`/`fi`):
  - inspired inert pp `= [fi / (1 − fO2)] · (Pa − p_s − Pwv)`
  - change-rate factor `= fi / (1 − fO2)`

`fi/(1−fO2)` is the inert gas's share of the non-oxygen part of the **diluent**.
For an air diluent it equals `0.79/0.79 = 1`, so CCR inert pp reduces to
`Pa − p_s − Pwv` — a useful sanity check. For a trimix diluent the N₂ and He
portions split by their ratio within the diluent.

Water vapour is folded into the setpoint term (`p_s + Pwv`), per the article's
update.

**Validity / shallow-water guard.** The CCR formula is only physical while
ambient pressure can sustain the setpoint, i.e. `Pa > p_s + Pwv`. When
`Pa ≤ p_s + Pwv` (very shallow / surface) the loop cannot hold the setpoint;
the CCR inert pressure clamps to `0` and the result is flagged so the UI can
warn. With a high setpoint of 1.3 bar this only bites at very shallow depths.

## Scope (v1)

In scope:

- Circuit toggle: OC (default) / CCR.
- CCR primary plan: a **single diluent**, a **low** setpoint on descent + bottom
  and a **high** setpoint on ascent + deco, auto-switching at the start of
  ascent. Loop is held for the entire dive.
- A **separate OC bailout schedule** assuming unit failure at the **end of
  bottom time** (deepest, most-loaded point), run on the existing deco-gas list.
- Refactor of the chart-sample path (`calculate-dive-profile.ts`) to use the
  real gas mix / circuit instead of hardcoded air. This is required for correct
  CCR charts and incidentally fixes OC trimix/nitrox charts.

Explicitly **out of scope for v1** (each a later iteration):

- Gas *volume* / SAC consumption for CCR and for bailout.
- Per-level diluent (single diluent only).
- More than two setpoints, or per-level setpoints.
- Hypoxic/hyperoxic diluent depth validation.
- CNS / OTU oxygen-exposure tracking.

## Approach

Chosen approach: **a "breathing source" strategy** — a pure function in
`dive-physics` that, given the circuit type, returns the inspired inert-gas
partial pressures (and change-rate factors). OC and CCR are two branches. The
integrator and the chart util both call it, so the new physics lives in one
tested place.

(Rejected alternatives: branching ad-hoc inside the integrator only — less
reusable, and would not cover the chart path; an "equivalent gas" shim — wrong
during depth changes, because the change-rate term genuinely differs.)

## Design

### 1. Breathing-source strategy — `packages/dive-physics/src/breathing-source.ts`

A pure module exporting:

```ts
type Circuit = 'OC' | 'CCR'

inspiredInertGas({
  circuit,            // 'OC' | 'CCR'
  ambientPressure,    // Pa, bar
  waterVaporPressure, // Pwv, bar
  gas,                // breathing gas (OC) or diluent (CCR): { fO2, fHe }
  setpoint            // bar, required for CCR, ignored for OC
}): {
  nitrogen: number          // alveolar inert pp, bar
  helium: number            // alveolar inert pp, bar
  nitrogenChangeRateFactor: number  // multiply by ambient-pressure rate
  heliumChangeRateFactor: number
  setpointUnsustainable: boolean    // true when clamped (CCR, Pa ≤ p_s + Pwv)
}
```

- **OC** composes the existing `alveolarInertGasPartialPressure` and uses
  `F_ig` as the change-rate factor (parity with today's behaviour).
- **CCR** computes `factor_ig = fi/(1−fO2)` split by diluent inert ratio, inert
  pp `= factor_ig · max(0, Pa − setpoint − Pwv)`, and sets
  `setpointUnsustainable` when `Pa ≤ setpoint + Pwv`.

The existing `alveolarInertGasPartialPressure` and `inspiredGasChangeRate`
remain exported (still used internally by the OC branch and by other callers).

### 2. Planner threading

- `Gas` is unchanged.
- `DivePlan` (planner `types.ts`) gains optional:
  `circuit?: 'OC' | 'CCR'` (default `'OC'`), `diluent?: Gas`,
  `setpointLow?: number`, `setpointHigh?: number`.
- `SegmentToIntegrate` / `DiveSegment` gain optional `circuit` and `setpoint`.
- `compartment-integrator.ts` `advance()` calls `inspiredInertGas` instead of
  the two functions directly; the Schreiner calls are otherwise unchanged.
- `levels-to-segments-interpolator.ts` tags each generated segment with the
  active setpoint: `setpointLow` on DESCENT / NAVIGATION, `setpointHigh` on
  ASCENT. In CCR mode the segment gas is the diluent.
- In the deco algorithm (`buhlmannZHL16-decompression-algorithm.ts`), generated
  ASCENT / DECO_STOP segments carry `circuit: 'CCR'` and `setpointHigh`. **The
  OC deco-gas machinery is bypassed in CCR mode** — no `best-deco-gas-selector`,
  no switch-at-MOD; the diluent is the back gas held at `setpointHigh` for the
  whole ascent.

### 3. Bailout schedule — `dive-planner.ts`

`calculateDiveProfileFromPlan(plan)` returns, for CCR plans, the primary loop
`DiveProfile` plus a `bailout?: DiveProfile`.

- Integrate the user segments on the loop up to the **end of bottom time**,
  capturing the compartment loads and the depth/time at that instant.
- Seed those loads into the **existing OC `createBuhlmannZHL16Algorithm`** with
  `availableGases` = the existing deco-gas list, and compute a normal OC ascent
  from the deepest point. The OC **back gas** for the bailout is the **diluent
  breathed open-circuit** (standard practice: the diluent doubles as the bottom
  bailout gas); deco-gas switches then proceed exactly as in an OC dive.
- Requires one small addition to the algorithm: an optional way to **seed
  initial compartment loads + start depth/time**, instead of always starting
  surface-saturated. Add an entry path; do not duplicate the algorithm.

### 4. Web state & UI

- **dive-plan slice** (`apps/web/state/dive-plan/types.ts` + slice) gains:
  `circuit: 'OC' | 'CCR'` (default `'OC'`), `setpointLow` (default `0.7`),
  `setpointHigh` (default `1.3`), `diluentGasId`.
- The `diveIntervalsSelector` / `diveProfileSamplesSelector` pass the new fields
  through to the planner and the chart util.
- **UI:** an OC/CCR toggle (Algorithm card, or a small dedicated Circuit
  control). In CCR mode: show two setpoint inputs + a diluent picker (reuse the
  existing gas selector); the deco-gas list re-labels as "bailout gases";
  OC-only controls (switch-at-MOD) hide.
- **Results:** decompression table + profile chart render the loop schedule; the
  bailout schedule renders as a secondary table/section labelled
  "Bailout from <depth> (end of bottom time)".

### 5. Chart-sample path — `apps/web/utils/calculate-dive-profile.ts`

Replace the hardcoded `0.79` N₂ / `0` He fractions with the breathing-source
strategy, taking the per-segment gas, circuit, and setpoint. This makes CCR
charts correct and fixes the pre-existing OC trimix/nitrox chart inaccuracy.

## Testing

- **dive-physics — `breathing-source`:** OC branch is numerically identical to
  the current `alveolarInertGasPartialPressure` + `inspiredGasChangeRate`; CCR
  branch matches worked values from the article; air-diluent CCR gives
  `factor = 1` (inert pp `= Pa − p_s − Pwv`); the shallow clamp sets
  `setpointUnsustainable` and `0` inert pp when `Pa ≤ p_s + Pwv`.
- **dive-planner:** a CCR dive yields a different (generally shorter) deco
  schedule than the equivalent OC dive; setpoint switches at start of ascent;
  the bailout schedule equals an OC dive seeded at the worst point.
- **web:** chart samples reflect the actual gas/circuit (regression test that an
  OC trimix chart now differs from the old air-only output).

## Open questions / risks

- Exact placement of the circuit toggle and setpoint inputs in the UI is a
  layout detail to settle during implementation; functionally they live with the
  algorithm/gas controls.
- The bailout back gas is the diluent breathed open-circuit. If the diluent's
  ppO₂ at the deepest point exceeds the safe limit (e.g. a hyperoxic diluent on
  a deep dive), v1 should surface a UI warning rather than fail silently — full
  diluent-breathability validation is deferred (out of scope above).
