import { Predicate, Transformer } from 'types'

export default <U, T = void, X = T>(
  predicate: Predicate<U>,
  onTrue: Transformer<U, T>,
  onFalse: Transformer<U, X>,
) => (value: U) => (predicate(value) ? onTrue : onFalse)(value)
