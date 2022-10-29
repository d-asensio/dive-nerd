import { createEffect } from '@regenerate/core'
import { createGraphqlEffect } from './effect'

export default function create (dependencies) {
  const effect = createGraphqlEffect(dependencies)
  return {
    query: createEffect(effect.query)
  }
}
