import { reduce } from 'ramda'

export const pipeWithArgs =
  (...fns) =>
  (first, ...rest) =>
    reduce((result, next) => next(result, ...rest), first, fns)
