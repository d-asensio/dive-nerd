import { gasMixTypeResolver as defaultGasMixNameResolver } from "@/utils/gasMixTypeResolver";
import {GasMix, GasMixType} from "@/utils/types";

interface GasMixFormatterDependencies {
  gasMixNameResolver?: typeof defaultGasMixNameResolver
}

export const createGasMixFormatter = (dependencies: GasMixFormatterDependencies = {}) => {
  const {
    gasMixNameResolver = defaultGasMixNameResolver
  } = dependencies

  function capitalize(word: string) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }

  function format(gasMix: GasMix) {
    const gasMixName = gasMixNameResolver.resolve(gasMix)
    if (gasMixName === GasMixType.OXYGEN) return `${capitalize(gasMixName)}`
    if (gasMixName === GasMixType.NITROX) return `${capitalize(gasMixName)} ${gasMix.fO2 * 100}`

    return `${capitalize(gasMixName)} ${gasMix.fO2 * 100}/${gasMix.fHe * 100}`
  }

  return {format}
}

export default createGasMixFormatter()
