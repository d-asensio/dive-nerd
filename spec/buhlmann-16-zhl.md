# Bühlmann ZH-L16C with Gradient Factors — Implementation Spec

This document is the **authoritative reference** for the decompression model
implemented in `packages/dive-physics` and `packages/dive-planner`. Every
formula here has a corresponding pure function (and tests) in `dive-physics`.
The dive planner orchestrates them; it does **not** introduce any physics of
its own.

Most of the notation follows Erik C. Baker's papers — they are the clearest
public source and are already in [`BIBLIOGRAPHY.md`](../BIBLIOGRAPHY.md). When
in doubt, that bibliography wins over this document.

---

## 1. Units and conventions

Everything in the core algorithm is expressed in **bar** for pressure and
**meters** for depth. Time is in **minutes**. The Schreiner equation accepts
any consistent unit system, but at the boundary with the dive planner we
commit to (bar, meter, minute).

| Symbol            | Meaning                                                   | Unit  |
| ----------------- | --------------------------------------------------------- | ----- |
| `P_amb`           | Ambient absolute pressure                                 | bar   |
| `P_surface`       | Surface ambient pressure (sea level ≈ 1.0133)             | bar   |
| `P_H2O`           | Alveolar water-vapour pressure                            | bar   |
| `P_alv,ig`        | Alveolar partial pressure of an inert gas                 | bar   |
| `P_t,ig`          | Tissue partial pressure of an inert gas in a compartment  | bar   |
| `P_t = P_t,N2 + P_t,He` | Total inert tissue tension                          | bar   |
| `a`, `b`          | Bühlmann ZH-L16C coefficients (per compartment, per gas)  | bar, dimensionless |
| `T½`              | Half-time of a compartment for a gas                      | min   |
| `k = ln(2) / T½`  | Time constant                                             | 1/min |
| `R`               | Rate of change of `P_alv,ig`                              | bar/min |
| `GF_low`, `GF_high` | Gradient factors at the first stop and at the surface   | 0..1  |

Compartment indices are `0..15` (16 compartments). ZH-L16**C** coefficients
are tabulated in
[`packages/dive-physics/src/buhlmannCompartments.ts`](../packages/dive-physics/src/buhlmannCompartments.ts).

## 2. Alveolar inert gas pressure

For a breathing gas mix with inert gas fraction `F_ig`:

```
P_alv,ig = (P_amb − P_H2O) · F_ig
```

`P_H2O` is the alveolar water-vapour pressure, computed once from the
respiratory-quotient correction (see `alveolarWaterVaporPressure`). We use
**Schreiner's** convention (`Rq = 0.9` is also acceptable; current code uses
`0.9`). This is documented in `dive-physics`.

## 3. Tissue loading — Schreiner equation

For a compartment with time constant `k` exposed for an interval of length
`t` (minutes), with alveolar pressure changing linearly at rate `R`:

```
P_t,ig(t) = P_alv,ig + R · (t − 1/k) − (P_alv,ig − P_t,ig(0) − R/k) · exp(−k·t)
```

When `R = 0` (constant depth) this reduces to the **Haldane equation**.

Each compartment tracks **two** inert gas tensions independently: `P_t,N2`
and `P_t,He`. They are integrated separately with their own half-times and
their own coefficients.

## 4. Bühlmann M-value

For a single inert gas, the **maximum tolerated tissue tension** at ambient
pressure `P_amb` is:

```
M(P_amb) = a + P_amb / b
```

Solving for the **tolerated ambient pressure** given a known tissue tension
`P_t,ig`:

```
P_amb,tol = (P_t,ig − a) · b
```

This is the un-corrected ("100%") Bühlmann ceiling — the shallowest absolute
pressure where this compartment is still within its tolerated supersaturation.

## 5. Coupled N₂ + He coefficients

When both nitrogen and helium are present in a compartment, ZH-L16 uses a
**partial-pressure-weighted average** of the per-gas coefficients (Bühlmann,
1984):

```
a = (a_N2 · P_t,N2 + a_He · P_t,He) / (P_t,N2 + P_t,He)
b = (b_N2 · P_t,N2 + b_He · P_t,He) / (P_t,N2 + P_t,He)
```

If both tissue tensions are zero we fall back to the N₂ coefficients (any
choice is fine; the compartment is empty so the ceiling is below the surface).

The combined M-value is then `M = a + P_amb / b`, evaluated against the total
inert load `P_t = P_t,N2 + P_t,He`.

## 6. Gradient factors

Gradient factors (Baker) interpolate linearly between **no supersaturation
allowed** (`GF = 0` → ceiling equals the absolute pressure at which
`P_t == P_amb`) and **the raw Bühlmann limit** (`GF = 1` → standard M-value).

For a given `GF ∈ [0, 1]`:

```
P_t,tol(GF) = P_amb + GF · (M(P_amb) − P_amb)
            = P_amb + GF · (a + P_amb/b − P_amb)
```

Solving for the tolerated ambient pressure:

```
P_amb,tol(GF) = (P_t − GF · a) / (GF/b + 1 − GF)
```

`GF_low` applies at the **first decompression stop**, `GF_high` at the
**surface**. Between the two, the effective `GF` varies **linearly with
depth** (equivalently, linearly with ambient pressure — the difference is
negligible and we use ambient pressure for numerical convenience):

```
GF(P_amb) = GF_high + (GF_low − GF_high) · (P_amb − P_surface) / (P_first_stop − P_surface)
```

- At `P_amb = P_first_stop` → `GF = GF_low`.
- At `P_amb = P_surface`   → `GF = GF_high`.
- Above the first stop (deeper) we clamp to `GF_low`; below the surface we
  clamp to `GF_high`. Clamping deeper than the first stop is what gives GF
  algorithms their characteristic shape during a "loose" descent ceiling.

The **first stop depth** is the shallowest 3 m multiple at or below the
maximum ceiling computed with `GF = GF_low` over the whole 16-compartment
set, evaluated at the moment ascent begins.

## 7. Ceiling

For one compartment with combined `a`, `b` and total inert load `P_t`, the
raw ceiling under a given `GF` is:

```
ceilingAmbientPressure_i(GF) = (P_t − GF · a) / (GF/b + 1 − GF)
```

For the diver as a whole:

```
divingCeilingAmbientPressure(GF) = max over i ∈ [0..15] of ceilingAmbientPressure_i(GF)
```

Note that this is the **raw mathematical** ceiling — it can be below the
surface ambient pressure (or even negative) when the diver is not
supersaturated. Clamping to the surface is the dive planner's job: it is
an environmental concern, not a physics one.

Converting to depth (sea water):

```
ceilingDepth = (P_amb − P_surface) · 100000 / (waterDensity · g)   // SI
```

with `g = 9.80665 m/s²`. In the planner we round the ceiling **up** to the
nearest 3 m multiple to obtain the deco stop depth.

## 8. Ascent algorithm (the missing piece today)

Given the dive segments produced by the levels-to-segments interpolator
(descent, navigation, ascent to surface), the decompression algorithm
replaces the final ascent with a sequence of **ascents + deco stops**:

1. **Initialise** the 16 compartments to surface-saturated values
   (`getSurfaceSaturatedCompartmentInertGasLoads`).
2. **Walk through every non-final segment** (descent, navigation,
   intermediate ascents) and integrate compartments with the Schreiner
   equation. Each integration uses the **current breathing gas** of that
   segment.
3. **Determine the first stop**:
   - Compute the diving ceiling at `GF = GF_low` against the current
     compartment loads.
   - Round **up** to the nearest 3 m multiple → `firstStopDepth`. If the
     resulting depth is `≤ 0`, no decompression is required (NDL dive).
4. **Build the ascent** from the last navigation depth to the first stop at
   `ascentRate`, integrating compartments along the way (this is a single
   ASCENT segment).
5. **Iterate stops** from `firstStopDepth` down to `0` in 3 m increments:
   - Pick the **best gas** available at this depth (see §9).
   - At each stop, integrate at constant depth in small time steps (e.g.
     0.1 min) until the ceiling computed with the **current effective GF**
     (interpolated between `GF_low` and `GF_high` at that depth) is at or
     above the **next shallower stop**.
   - Round the stop duration **up** to the next whole minute (operational
     convention; configurable).
   - Emit a `DECO_STOP` segment.
   - Then a short `ASCENT` segment of 3 m at `ascentRate`, integrating
     compartments through it.
6. After the 3 m stop, the final ASCENT to the surface is emitted.
7. The algorithm returns a `DiveProfile` containing every segment plus, for
   each segment boundary, the 16-compartment inert-gas load snapshot and the
   ceiling at that instant.

The time step used for stop integration is an **injected dependency** so the
algorithm can be tested deterministically with a coarse step (e.g. 1 min) and
run at higher fidelity (0.1 min) in production.

## 9. Gas switching

A gas can be marked `isDecoGas: true`. During the ascent / deco phase the
algorithm selects, at each stop, the **deco gas with the highest `F_O2`**
whose **Maximum Operating Depth (MOD)** at `ppO2 = 1.6 bar` (configurable) is
at or below the current depth. If no deco gas qualifies, the planner falls
back to the gas of the last navigation segment ("back gas").

The MOD utility already lives at
[`apps/web/utils/maximum-operating-depth.ts`](../apps/web/utils/maximum-operating-depth.ts);
it will be lifted into `dive-planner` so it can be reused server-side.

## 10. Verification cases

These are the canonical test dives we will pin in the test suite. Reference
values come from Subsurface (which implements the same ZH-L16C + Baker GF
model) for an equivalent configuration. All on sea water (ρ = 1023.6 kg/m³),
sea-level surface (1.0133 bar), descent 10 m/min, ascent 9 m/min,
`P_H2O = 0.0567 bar` (Workman, `Rq = 0.9`).

| # | Plan                          | GF       | Expected first stop | Expected total deco |
| - | ----------------------------- | -------- | ------------------- | ------------------- |
| 1 | 30 m / 25 min on air          | 100/100  | none (NDL)          | 0 min               |
| 2 | 45 m / 25 min on air          | 30/85    | 18 m                | ~18–22 min          |
| 3 | 45 m / 25 min on EAN32 + O₂   | 30/85    | 18 m                | ~12–14 min          |

These are **acceptance targets**, not exact figures. The exact minutes depend
on the deco-step quantisation (rounding-up rule, integration step). We pin
the test against a fixed quantisation in the test file.

## 11. What lives where

```
packages/dive-physics/                  Pure, stateless math. No I/O, no DI.
  src/buhlmannCompartments.ts           ZH-L16C constant table (existing)
  src/index.ts                          Existing: Schreiner, alveolar, ambient pressure
  src/m-value.ts                        §4
  src/coupled-buhlmann-coefficients.ts  §5
  src/gradient-factor.ts                §6
  src/compartment-ceiling.ts            §7 (one compartment)
  src/diving-ceiling.ts                 §7 (over all compartments — "first class collection")

packages/dive-planner/                  Stateful orchestration via factories + DI.
  src/buhlmannZHL16-decompression-algorithm.ts   §8 (implementation lives here)
  src/gas-selector.ts                   §9
  src/levels-to-segments-interpolator.ts (existing)
  src/dive-planner.ts                   Top-level factory wiring the deps together
```

The split honours the rule: **`dive-physics` knows nothing about dives,
gases or plans — it only knows numbers and the ZH-L16C constants**. The
planner is where the "story" of a dive lives.
