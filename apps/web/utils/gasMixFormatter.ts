import { gasMixTypeResolver as defaultGasMixNameResolver } from "@/utils/gasMixTypeResolver";
import {GasMix, GasMixType} from "@/utils/types";

interface GasMixFormatterFactoryDependencies {
  gasMixNameResolver?: typeof defaultGasMixNameResolver
}

export const createGasMixFormatter = (dependencies: GasMixFormatterFactoryDependencies = {}) => {
  const {
    gasMixNameResolver = defaultGasMixNameResolver
  } = dependencies

  function capitalize(word: string) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }

  const formatGasFraction = (gasFraction: number) =>
    Math.trunc(gasFraction * 100)

  function format(gasMix: GasMix) {
    const gasMixName = gasMixNameResolver.resolve(gasMix)

    if ([GasMixType.IMPOSSIBLE_MIX].includes(gasMixName)) return 'Impossible Mix'
    if ([GasMixType.OXYGEN, GasMixType.AIR].includes(gasMixName)) return `${capitalize(gasMixName)}`
    if (gasMixName === GasMixType.NITROX) return `${capitalize(gasMixName)} ${formatGasFraction(gasMix.fO2)}`

    return `${capitalize(gasMixName)} ${formatGasFraction(gasMix.fO2)}/${formatGasFraction(gasMix.fHe)}`
  }

  return {format}
}

export const gasMixFormatter = createGasMixFormatter()
