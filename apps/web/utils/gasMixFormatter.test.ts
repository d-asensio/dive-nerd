import {when} from "jest-when"

import {GasMix, GasMixType} from "@/utils/types";
import {createGasMixFormatter} from "@/utils/gasMixFormatter";

describe('createGasMixFormatter.format', () => {
  it('labels nitrox mixes with the O2 percentage', () => {
    const gasMix: GasMix = { fO2: .32, fHe: .0 }
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(GasMixType.NITROX)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe("Nitrox 32")
  })

  it('does not label air', () => {
    const gasMix: GasMix = { fO2: .21, fHe: .0 }
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(GasMixType.AIR)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe("Air")
  })

  it('does not label pure (or nearly pure) oxygen mixes', () => {
    const gasMix: GasMix = { fO2: .99, fHe: .0 }
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(GasMixType.OXYGEN)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe("Oxygen")
  })

  it.each([
    {
      gasMix: { fO2: .28, fHe: 0 },
      gasMixName: GasMixType.NITROX,
      expectedResult: "Nitrox 28"
    },
    {
      gasMix: { fO2: .21, fHe: .1 },
      gasMixName: GasMixType.HELITROX,
      expectedResult: "Helitrox 21/10"
    },
    {
      gasMix: { fO2: .28, fHe: .07 },
      gasMixName: GasMixType.HELITROX,
      expectedResult: "Helitrox 28/7"
    },
    {
      gasMix: { fO2: .18, fHe: .1 },
      gasMixName: GasMixType.TRIMIX,
      expectedResult: "Trimix 18/10"
    },
    {
      gasMix: { fO2: .20, fHe: .80 },
      gasMixName: GasMixType.HELIOX,
      expectedResult: "Heliox 20/80"
    }
  ])('labels $gasMixName mixes with (O2: $gasMix.fO2, He: $gasMix.fHe)', ({ gasMix, gasMixName, expectedResult }) => {
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(gasMixName)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe(expectedResult)
  })
})
