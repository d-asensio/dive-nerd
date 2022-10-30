import graphql from '../../effects/graphql'
import store from '../../effects/store'

import { saveDivesMutation } from './mutations'
import { getAllDivesQuery } from './queries'

export const divesService = (function IIFE () {
  function * fetchDives () {
    const { dives } = yield graphql.query(getAllDivesQuery)

    yield store.mutate(saveDivesMutation, dives)
  }

  return {
    fetchDives
  }
})()
