import graphql from '../../effects/graphql'
import store from '../../effects/store'

import { highlightDiveMutation, saveDivesMutation } from './mutations'
import { getAllDivesQuery } from './queries'

export const divesService = (function IIFE () {
  function * fetchDives () {
    const { dives } = yield graphql.query(getAllDivesQuery)

    yield store.mutate(saveDivesMutation, dives)
  }

  function * highlightDive (diveId) {
    yield store.mutate(highlightDiveMutation, diveId)
  }

  return {
    fetchDives,
    highlightDive
  }
})()
