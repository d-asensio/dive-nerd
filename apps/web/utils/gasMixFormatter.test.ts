import {when} from "jest-when"

import {GasMix, GasMixName} from "@/utils/types";
import {createGasMixFormatter} from "@/utils/createGasMixFormatter";

describe('createGasMixFormatter.format', () => {
  it('labels nitrox mixes with the O2 percentage', () => {
    const gasMix: GasMix = { fO2: .32, fHe: .0 }
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(GasMixName.NITROX)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe("Nitrox 32")
  })

  it('does not label pure (or nearly pure) oxygen mixes', () => {
    const gasMix: GasMix = { fO2: .99, fHe: .0 }
    const gasMixNameResolver = {
      resolve: jest.fn()
    }
    const gasMixFormatter = createGasMixFormatter({ gasMixNameResolver })
    when(gasMixNameResolver.resolve)
      .calledWith(gasMix)
      .mockReturnValue(GasMixName.OXYGEN)

    const result = gasMixFormatter.format(gasMix)

    expect(result).toBe("Oxygen")
  })

  it.each([
    {
      gasMix: { fO2: .21, fHe: .1 },
      gasMixName: GasMixName.HELITROX,
      expectedResult: "Helitrox 21/10"
    },
    {
      gasMix: { fO2: .18, fHe: .1 },
      gasMixName: GasMixName.TRIMIX,
      expectedResult: "Trimix 18/10"
    },
    {
      gasMix: { fO2: .20, fHe: .80 },
      gasMixName: GasMixName.HELIOX,
      expectedResult: "Heliox 20/80"
    }
  ])('labels $gasMixName mixes with the 02 and He percentages', ({ gasMix, gasMixName, expectedResult }) => {
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
